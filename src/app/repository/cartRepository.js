import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import ProductInventory from '../models/ProductInventory.js';
import ProductInventoryDetail from '../models/ProductInventoryDetailAttribute.js';

class CartRepository {
  async findByUserId(userId) {
    try {
      return await Cart.findOne({ user_id: userId }).lean();
    } catch (error) {
      console.error('CartRepo findByUserId error:', error);
      throw error;
    }
  }

  async createOrUpdate(userId, cartData) {
    try {
      return await Cart.findOneAndUpdate(
        { user_id: userId },
        { $set: cartData },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error('CartRepo createOrUpdate error:', error);
      throw error;
    }
  }

  async getProductDetails(productId) {
    try {
      return await Product.findById(productId)
      
       .lean();
    } catch (error) {
      console.error('CartRepo getProductDetails error:', error);
      throw error;
    }
  }

  async getInventoryDetails(productId, variantId = null) {
    try {
      const inventory = await ProductInventory.findOne({ product: productId }).lean();
      if (!inventory) return null;

      if (variantId) {
        const variant = await ProductInventoryDetail.findById(variantId).lean();
        return { inventory, variant };
      }
      return { inventory };
    } catch (error) {
      console.error('CartRepo getInventoryDetails error:', error);
      throw error;
    }
  }
}

export default CartRepository;