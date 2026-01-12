import Product from "../models/Product.js";
import CrudRepository from "./crud-repository.js";
import ProductInventory from "../models/ProductInventory.js";
import ProductInventoryDetails from "../models/ProductInventoryDetails.js";
import ProductInventoryDetailAttribute from "../models/ProductInventoryDetailAttribute.js";
import category from "../models/Category.js";
import subCategory from "../models/SubCategory.js";
import Brand from "../models/brand.js";

class ProductRepository extends CrudRepository {
  constructor() {
    super(Product);
  }

  async findByCatIdAndSlug(catId, slug) {
    try {
      // Fetch product with populated category, subcategory, badge, and brand
      const product = await Product.findOne({
        category_id: catId,
        slug,
        deletedAt: null,
      })
        .populate("category_id", "name slug") // Populate category name and slug
        .populate("subCategory_id", "name slug") // Populate subcategory name and slug

        .populate("brand", "name slug") // Populate brand name and slug
        .lean(); // Use lean for performance

      if (!product) return null;

      // Fetch related inventory
      const inventory = await ProductInventory.findOne({
        product: product?._id,
      }).lean(); // Use lean for performance

      if (inventory) {
        // Fetch inventory details
        const inventoryDetails = await ProductInventoryDetails.find({
          product_id: product._id,
          product_inventory_id: inventory._id,
        }).lean();

        // Fetch attributes for inventory details
        const inventoryDetailIds = inventoryDetails.map((detail) => detail._id);
        const attributes = await ProductInventoryDetailAttribute.find({
          inventory_details_id: { $in: inventoryDetailIds },
          product_id: product._id,
        }).lean();

        // Attach attributes to their respective inventory details
        inventory.inventory_details = inventoryDetails.map((detail) => ({
          ...detail,
          attributes: attributes.filter(
            (attr) =>
              attr.inventory_details_id.toString() === detail._id.toString()
          ),
        }));

        // Attach inventory to product
        product.inventory = inventory;
      } else {
        // If no inventory exists, set an empty inventory object to match expected structure
        product.inventory = null;
      }

      return product;
    } catch (error) {
      console.error("Repo findById error:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      // Fetch product with populated category, subcategory, badge, and brand
      const product = await Product.findOne({ _id: id, deletedAt: null })
        .populate("category_id", "name slug") // Populate category name and slug
        .populate("subCategory_id", "name slug") // Populate subcategory name and slug

        .populate("brand", "name slug")

        .lean(); // Use lean for performance

      if (!product) return null;

      // Fetch related inventory
      const inventory = await ProductInventory.findOne({ product: id }).lean(); // Use lean for performance

      if (inventory) {
        // Fetch inventory details
        const inventoryDetails = await ProductInventoryDetails.find({
          product_id: id,
          product_inventory_id: inventory._id,
        }).lean();

        // Fetch attributes for inventory details
        const inventoryDetailIds = inventoryDetails.map((detail) => detail._id);
        const attributes = await ProductInventoryDetailAttribute.find({
          inventory_details_id: { $in: inventoryDetailIds },
          product_id: id,
        }).lean();

        // Attach attributes to their respective inventory details
        inventory.inventory_details = inventoryDetails.map((detail) => ({
          ...detail,
          attributes: attributes.filter(
            (attr) =>
              attr.inventory_details_id.toString() === detail._id.toString()
          ),
        }));

        // Attach inventory to product
        product.inventory = inventory;
      } else {
        // If no inventory exists, set an empty inventory object to match expected structure
        product.inventory = null;
      }

      return product;
    } catch (error) {
      console.error("Repo findById error:", error);
      throw error;
    }
  }

  async create(data) {
    try {
      const product = new Product(data);
      console.log("Data for create:", data);
      return await product.save();
    } catch (error) {
      console.error("Repo create error:", error);
      throw error;
    }
  }

  async createInventory(data) {
    try {
      // Validate required fields
      if (!data || !data.product) {
        throw new Error("Product ID is required to create inventory");
      }
      
      // Ensure SKU is always provided - generate if missing
      if (!data.sku || !data.sku.trim()) {
        // Convert product to string if it's an ObjectId
        const productId = data.product.toString ? data.product.toString() : data.product;
        data.sku = `SKU-${productId}-${Date.now()}`;
      } else {
        data.sku = data.sku.trim();
      }
      
      const inventory = new ProductInventory(data);
      const savedInventory = await inventory.save();
      
      if (!savedInventory || !savedInventory._id) {
        throw new Error("Failed to save inventory - no _id returned");
      }
      
      return savedInventory;
    } catch (error) {
      console.error("Repo createInventory error:", error);
      throw error;
    }
  }

  async createInventoryDetails(data) {
    try {
      const inventoryDetails = new ProductInventoryDetails(data);
      return await inventoryDetails.save();
    } catch (error) {
      console.error("Repo createInventoryDetails error:", error);
      throw error;
    }
  }

  async createInventoryDetailsAttributes(data) {
    try {
      console.log("Data for createInventoryDetailsAttributes:", data);
      if (Array.isArray(data)) {
        return await ProductInventoryDetailAttribute.insertMany(data);
      }
      return await ProductInventoryDetailAttribute.create(data);
    } catch (error) {
      console.log("Repo createInventoryDetailsAttributes error:", error);
      throw error;
    }
  }

  async findByName(title) {
    try {
      return await this.model.findOne({ name: title, deletedAt: null });
    } catch (error) {
      console.error("Repo findByName error:", error);
      throw error;
    }
  }

async update(id, data) {
  try {
    const product = await Product.findById(id);
    if (!product || product.deletedAt) return null;

    product.set(data);
    return await product.save();
  } catch (error) {
    console.error("Repo update error:", error);
    console.log("Validation errors:", error.messages);
    throw error;
  }
}

async updateInventory(id, data) {
  try {
    const inventory = await ProductInventory.findById(id);
    if (!inventory) return null;

    inventory.set(data);
    return await inventory.save();
  } catch (error) {
    console.error("Repo updateInventory error:", error);
    throw error;
  }
}

async updateInventoryDetails(id, data) {
  try {
    const inventoryDetails = await ProductInventoryDetails.findById(id);
    if (!inventoryDetails) return null;

    inventoryDetails.set(data);
    return await inventoryDetails.save();
  } catch (error) {
    console.error("Repo updateInventoryDetails error:", error);
    throw error;
  }
}

async updateInventoryDetailsAttributes(id, data) {
  try {
    console.log("id:", id);
    const attribute = await ProductInventoryDetailAttribute.findById(id);
    if (!attribute) return null;

    attribute.set(data);
    return await attribute.save();
  } catch (error) {
    console.error("Repo updateInventoryDetailsAttributes error:", error);
    throw error;
  }
}

  async deleteInventory(id) {
    try {
      return await ProductInventory.findByIdAndDelete(id);
    } catch (error) {
      console.error("Repo deleteInventory error:", error);
      throw error;
    }
  }

  async deleteInventoryDetails(id) {
    try {
      return await ProductInventoryDetails.findByIdAndDelete(id);
    } catch (error) {
      console.error("Repo deleteInventoryDetails error:", error);
      throw error;
    }
  }

  async deleteInventoryDetailsAttribute(id) {
    try {
      return await ProductInventoryDetailAttribute.findByIdAndDelete(id);
    } catch (error) {
      console.error("Repo deleteInventoryDetailsAttribute error:", error);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      return await Product.findByIdAndDelete(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      console.error("Repo softDelete error:", error);
      throw error;
    }
  }

  async findAll(filter = {}, sort = {}, skip = 0, limit = 10) {
    try {
      return await Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("category_id")
        .populate("subCategory_id")
        .populate("brand")
        .populate("vendor", "username email storeName contactNumber role isActive") // Populate vendor details
        .lean();
    } catch (error) {
      console.error("Repo findAll error:", error);
      throw error;
    }
  }

  async countDocuments(filter = {}) {
    try {
      return await Product.countDocuments(filter);
    } catch (error) {
      console.error("Repo countDocuments error:", error);
      throw error;
    }
  }
}

export default ProductRepository;
