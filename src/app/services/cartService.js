import CartRepository from '../repository/cartRepository.js';
import AppError from '../utils/errors/app-error.js';
import { StatusCodes } from 'http-status-codes';
import initRedis from '../config/redis.js';
import mongoose from 'mongoose';
import ProductInventory from '../models/ProductInventory.js';
import ProductInventoryDetail from '../models/ProductInventoryDetailAttribute.js';
import Size from '../models/size.js';
import Color from '../models/ColorCode.js';

const redis = initRedis();

class CartService {
  constructor() {
    this.cartRepo = new CartRepository();
  }

  async ensureMongooseConnection() {
    if (mongoose.connection.readyState !== 1) {
      console.log('Mongoose connection not ready, attempting to connect...');
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Mongoose connection established');
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        throw new AppError('Database connection failed', StatusCodes.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async addToCart(userId, data) {
    await this.ensureMongooseConnection();
    const { product_id, quantity, pid_id, product_variant, selected_size, selected_color } = data;

    // Validate input
    if (!product_id || !quantity) {
      throw new AppError('Product ID and quantity are required', StatusCodes.BAD_REQUEST);
    }

    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', StatusCodes.BAD_REQUEST);
    }

    // Fetch product details
    const product = await this.cartRepo.getProductDetails(product_id);
    if (!product) {
      throw new AppError('Product not found', StatusCodes.NOT_FOUND);
    }

    // Fetch inventory details
    const inventoryDetails = await this.cartRepo.getInventoryDetails(product_id, product_variant);
    if (!inventoryDetails?.inventory) {
      throw new AppError('Inventory not found for this product', StatusCodes.NOT_FOUND);
    }

    const { inventory, variant } = inventoryDetails;

    // Check existing cart item
    let cart = await this.cartRepo.findByUserId(userId);
    let existingItem = cart?.items.find(
      (item) =>
        item.product_id.toString() === product_id &&
        (!product_variant || item.variant_id?.toString() === product_variant)
    );

    const currentQty = existingItem?.quantity || 0;
    const requestedQty = currentQty + parseInt(quantity);

    // Validate min/max purchase
    if (product.minPurchase && requestedQty < product.minPurchase) {
      throw new AppError(
        `This product requires a minimum quantity of ${product.minPurchase}`,
        StatusCodes.BAD_REQUEST
      );
    }

    if (product.maxPurchase && requestedQty > product.maxPurchase) {
      throw new AppError(
        `This product allows a maximum quantity of ${product.maxPurchase}`,
        StatusCodes.BAD_REQUEST
      );
    }

    // Check stock availability
    let stockCount = inventory.stock_count;
    if (product_variant && variant) {
      stockCount = variant.stock_count;
      if (requestedQty > variant.stock_count) {
        throw new AppError(
          'Requested quantity exceeds available stock for this variant',
          StatusCodes.BAD_REQUEST
        );
      }
    } else if (requestedQty > inventory.stock_count) {
      throw new AppError(
        'Requested quantity exceeds available stock',
        StatusCodes.BAD_REQUEST
      );
    }

    // Calculate price
    let finalPrice = product.saleprice || product.price || 0;
    let additionalPrice = 0;

    if (variant) {
      additionalPrice = variant.additional_price || 0;
    }

    finalPrice += additionalPrice;

    // Prepare cart item options
    const options = {
      image: variant?.image?.[0] || product.image?.[0] || '',
      used_categories: {
        category: product.category_id?._id,
        subcategory: product.subCategory_id?._id || null,
      },
      type: 'product',
      vendor_id: product.vendor || null,
      slug: product.slug,
      sku: inventory.sku || product.slug,
      regular_price: product.price || 0,
      tax_options_sum_rate: 0, // Placeholder; implement tax logic if needed
    };

    if (product_variant) {
      const size = await Size.findById(selected_size).lean();
      const color = await Color.findById(selected_color).lean();
      options.variant_id = product_variant;
      options.color_name = color?.name || '';
      options.size_name = size?.name || '';
      // Fetch attributes if needed
      const attributes = await ProductInventoryDetail.findById(product_variant)
        .select('attributes')
        .lean();
      options.attributes = attributes?.attributes || [];
    }

    // Update or add cart item
    if (!cart) {
      cart = {
        user_id: userId,
        items: [
          {
            product_id,
            quantity: parseInt(quantity),
            variant_id: product_variant || null,
            selected_size: selected_size || null,
            selected_color: selected_color || null,
            price: finalPrice,
            options,
          },
        ],
      };
    } else {
      if (existingItem) {
        existingItem.quantity = requestedQty;
        existingItem.price = finalPrice;
        existingItem.options = options;
      } else {
        cart.items.push({
          product_id,
          quantity: parseInt(quantity),
          variant_id: product_variant || null,
          selected_size: selected_size || null,
          selected_color: selected_color || null,
          price: finalPrice,
          options,
        });
      }
    }

    // Save cart
    const updatedCart = await this.cartRepo.createOrUpdate(userId, cart);

    // Update Redis cache
    await redis.setex(`cart:${userId}`, 3600, JSON.stringify(updatedCart));

    return updatedCart;
  }

  async getCart(userId) {
    await this.ensureMongooseConnection();
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) {
      return { user_id: userId, items: [] };
    }
    return cart;
  }
}

export default CartService;