import ProductRepository from "../repository/productRepository.js";
import AppError from "../utils/errors/app-error.js";
import { StatusCodes } from "http-status-codes";
import { saveFile, validateImageFile } from "../lib/fileUpload.js";
import ProductInventory from "../models/ProductInventory.js";
import Category from "../models/Category.js";
import ProductInventoryDetailAttribute from "../models/ProductInventoryDetailAttribute.js"; // Static import
import mongoose from "mongoose"; // Import mongoose to check connection status
import md5 from "md5"; // Import md5 for hashing
import Product from "../models/Product.js"; // Assuming Product model is defined in Product.js
import ProductInventoryDetail from "../models/ProductInventoryDetails.js"; // Assuming ProductInventoryDetail model is
import ColorCode from "../models/ColorCode.js"; // Assuming Color model is defined in ColorCode.js
import Size from "../models/size.js"; // Assuming Size model is defined in Size.js
import ProductAttribute from "../models/productAttribute.js"; // Assuming ProductAttribute model is defined in ProductAttribute.js
// import ProductInventoryDetailAttribute from "../models/ProductInventoryDetailAttribute.js"; // Assuming ProductInventoryDetailAttribute model is defined in ProductInventoryDetailAttribute.js

class ProductService {
  constructor() {
    this.productRepo = new ProductRepository();
    // Verify that ProductInventoryDetailAttribute is defined
  }

  // Ensure Mongoose connection is ready before executing operations
  async ensureMongooseConnection() {
    if (mongoose.connection.readyState !== 1) {
      // // console.log("Mongoose connection not ready, attempting to connect...");
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        // // console.log("Mongoose connection established");
      } catch (error) {
        // // console.error("Failed to connect to MongoDB:", error.message);
        throw new AppError(
          "Database connection failed",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async createProduct(data) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Create Product data Services:", data);
      return await this.productRepo.create(data);
    } catch (error) {
      // // console.error("Error in createProduct:", error.message);
      throw error;
    }
  }

  async createInventory(data) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Create Inventory data:", data);
      return await this.productRepo.createInventory(data);
    } catch (error) {
      // // console.error("Error in createInventory:", error.message);
      throw error;
    }
  }

  async createInventoryDetails(data) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Create Inventory Details data:", data);
      return await this.productRepo.createInventoryDetails(data);
    } catch (error) {
      // // console.error("Error in createInventoryDetails:", error.message);
      throw error;
    }
  }

  async createInventoryDetailsAttributes(data) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Create Inventory Details Attributes data:", data);
      return await this.productRepo.createInventoryDetailsAttributes(data);
    } catch (error) {
      // // console.error(
      //   "Error in createInventoryDetailsAttributes:",
      //   error.message
      // );
      throw error;
    }
  }

  async batchCreateInventoryDetails(dataArray) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Batch Create Inventory Details:", dataArray.length, "items");
      const promises = dataArray.map((data) =>
        this.productRepo.createInventoryDetails(data)
      );
      const results = await Promise.all(promises);
      // // console.log("Batch created inventory details:", results.length);
      return results;
    } catch (error) {
      // // console.error("Error in batchCreateInventoryDetails:", error.message);
      throw error;
    }
  }

  async batchCreateInventoryDetailsAttributes(dataArray) {
    try {
      await this.ensureMongooseConnection();
      // console.log(
      //   "Batch Create Inventory Details Attributes:",
      //   dataArray.length,
      //   "items"
      // );
      const groupedAttributes = dataArray.reduce((acc, attr) => {
        const key = attr.inventory_details_id;
        if (!acc[key]) acc[key] = [];
        acc[key].push(attr);
        return acc;
      }, {});
      const promises = Object.values(groupedAttributes).map((attributeGroup) =>
        this.productRepo.createInventoryDetailsAttributes(attributeGroup)
      );
      const results = await Promise.all(promises);
      // console.log("Batch created attributes:", results.flat().length);
      return results.flat();
    } catch (error) {
      // console.error(
      //   "Error in batchCreateInventoryDetailsAttributes:",
      //   error.message
      // );
      throw error;
    }
  }

  async createInventoryDetailsWithAttributes(inventoryDetailsArray) {
    try {
      await this.ensureMongooseConnection();
      const createdDetails = [];
      const allAttributes = [];
      for (const detailData of inventoryDetailsArray) {
        const { attributes, ...inventoryDetailData } = detailData;
        const createdDetail = await this.createInventoryDetails(
          inventoryDetailData
        );
        createdDetails.push(createdDetail);
        if (attributes && attributes.length > 0) {
          const detailAttributes = attributes.map((attr) => ({
            ...attr,
            inventory_details_id: createdDetail._id,
          }));
          allAttributes.push(...detailAttributes);
        }
      }
      if (allAttributes.length > 0) {
        await this.batchCreateInventoryDetailsAttributes(allAttributes);
      }
      return createdDetails;
    } catch (error) {
      // console.error(
      //   "Error in createInventoryDetailsWithAttributes:",
      //   error.message
      // );
      throw error;
    }
  }

  async updateProduct(id, data, files = {}) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Update Product data:", data);
      const { mainImage, itemVariants } = files;

      // // console.log("Files received for update:", files);

      // // console.log("Main image:", id);

      // Fetch existing product
      const product = await this.productRepo.findById(id);
      if (!product)
        throw new AppError("Product not found", StatusCodes.NOT_FOUND);

      // Prepare updated product data - only include fields that are provided
      const updatedData = {};

      if (data.name !== undefined) updatedData.name = data.name;
      if (data.category_id !== undefined)
        updatedData.category_id = data.category_id;
      if (data.subCategory_id !== undefined)
        updatedData.subCategory_id = data.subCategory_id;
      if (data.slug !== undefined) updatedData.slug = data.slug;
      if (data.summary !== undefined) updatedData.summary = data.summary;
      if (data.description !== undefined)
        updatedData.description = data.description;
      if (data.price !== undefined) updatedData.price = parseFloat(data.price);
      if (data.saleprice !== undefined)
        updatedData.saleprice = parseFloat(data.saleprice);
      if (data.cost !== undefined) updatedData.cost = parseFloat(data.cost);
      if (data.badge_id !== undefined)
        updatedData.badge_id = parseInt(data.badge_id);
      if (data.brand_id !== undefined) updatedData.brand_id = data.brand_id;
      if (data.min_purchase !== undefined)
        updatedData.min_purchase = parseInt(data.min_purchase);
      if (data.max_purchase !== undefined)
        updatedData.max_purchase = parseInt(data.max_purchase);
      if (data.is_inventory_warn_able !== undefined)
        updatedData.is_inventory_warn_able = data.is_inventory_warn_able;
      if (data.is_refundable !== undefined)
        updatedData.is_refundable = data.is_refundable;
      if (data.isTaxable !== undefined)
        updatedData.isTaxable = data.isTaxable;
      // Added is_diamond to updated product data
      if (data.is_diamond !== undefined)
        updatedData.is_diamond = data.is_diamond;

      // Allow updating approval and status flags when provided
      if (data.is_approved !== undefined) updatedData.is_approved = data.is_approved;
      if (data.status !== undefined) updatedData.status = data.status;

      // Ensure 'featured' flag from update payload is applied
      if (data.featured !== undefined) updatedData.featured = data.featured;

      // Handle taxClass based on isTaxable
      if (data.isTaxable !== undefined) {
        if (data.isTaxable === true || data.taxClass !== undefined) {
          updatedData.taxClass = data.taxClass;
        } else if (data.isTaxable === false) {
          updatedData.taxClass = null;
        }
      }

      // Set image if updated
      if (data.image) {
        updatedData.image = data.image;
      }

      // // console.log("Updated product data:", updatedData);
      const updatedProduct = await this.productRepo.update(id, updatedData);
      // // console.log("final updatedProduct:", updatedProduct);
      if (!updatedProduct)
        throw new AppError(
          "Product update failed",
          StatusCodes.INTERNAL_SERVER_ERROR
        );

      // Update or create inventory if provided
      if (data.sku !== undefined || data.quantity !== undefined) {
        const inventory = await ProductInventory.findOne({ product: id });
        const inventoryData = {};
        if (data.sku !== undefined) inventoryData.sku = data.sku;
        if (data.quantity !== undefined)
          inventoryData.stock_count = parseInt(data.quantity);

        if (inventory) {
          await this.productRepo.updateInventory(
            inventory._id,
            inventoryData
          );
        } else {
          // Create new inventory if none exists
          const newInventoryData = {
            product: id,
            sku: data.sku || `SKU-${id}-${Date.now()}`,
            stock_count: data.quantity ? parseInt(data.quantity) : 0,
            sold_count: 0,
          };
          await this.productRepo.createInventory(newInventoryData);
        }
      }

      return updatedProduct;
    } catch (error) {
      // // console.log("Error in updateProduct:", error.message, error.stack);
      throw error;
    }
  }

  async updateInventoryDetailsWithAttributes(productId, itemVariants) {
    try {
      await this.ensureMongooseConnection();
      const createdDetails = [];
      const allAttributes = [];

      // Get product inventory
      let inventory = await ProductInventory.findOne({ product: productId });
      if (!inventory) {
        // Create new inventory if none exists
        inventory = await this.productRepo.createInventory({
          product: productId,
          sku: `SKU-${productId}-${Date.now()}`,
          stock_count: 0,
          sold_count: 0,
        });
      }

      for (const variant of itemVariants) {
        const { attributes, image, inventoryDetailsId, ...variantData } = variant;

        // // console.log("Variant details : ==> " + inventoryDetailsId, variantData);

        // Handle image upload
        let imageUrl = "";
        if (image && image instanceof File) {
          validateImageFile(image);
          imageUrl = await saveFile(
            image,
            "products",
            `item_${productId}_${inventoryDetailsId || Date.now()}`
          );
          // // console.log("Variant image updated:", imageUrl);
        }

        // Prepare detail data - only include defined fields
        const detailData = {
          product_id: productId,
          product_inventory_id: inventory._id,
        };

        if (variantData.size !== undefined) detailData.size = variantData.size;
        if (variantData.color !== undefined) detailData.color = variantData.color;
        if (variantData.additional_price !== undefined)
          detailData.additional_price = parseFloat(variantData.additional_price);
        if (variantData.extra_cost !== undefined)
          detailData.extra_cost = parseFloat(variantData.extra_cost);
        if (variantData.stock_count !== undefined)
          detailData.stock_count = parseInt(variantData.stock_count);
        if (variantData.sku !== undefined)
          detailData.sku = variantData.sku;


        // Handle image
        if (imageUrl) {
          detailData.image = [imageUrl];
        } else if (variantData.image && Array.isArray(variantData.image)) {
          detailData.image = variantData.image;
        }

        let createdDetail;
        if (inventoryDetailsId) {
          // Update existing inventory detail
          createdDetail = await this.productRepo.updateInventoryDetails(
            inventoryDetailsId,
            detailData
          );
        } else {
          // Create new inventory detail
          createdDetail = await this.productRepo.createInventoryDetails(
            detailData
          );
        }

        if (createdDetail) {
          createdDetails.push(createdDetail);

          // Handle attributes
          if (attributes && attributes.length > 0) {
            const detailAttributes = attributes.map((attr) => ({
              ...attr,
              inventory_details_id: createdDetail._id,
              product_id: productId,
            }));
            allAttributes.push(...detailAttributes);
          }
        }
      }

      // Process attributes
      if (allAttributes.length > 0) {
        let existingAttributes = [];
        try {
          // // console.log(
          //   "Fetching existing attributes for inventory_details_id:",
          //   createdDetails.map((d) => d._id)
          // );
          existingAttributes = await ProductInventoryDetailAttribute.find({
            inventory_details_id: { $in: createdDetails.map((d) => d._id) },
          }).lean();
          // console.log("Fetched existing attributes:", existingAttributes.length);
        } catch (error) {
          // console.error(
          //   "Error fetching existing attributes:",
          //   error.message,
          //   error.stack
          // );
          throw new AppError(
            "Failed to fetch existing attributes",
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }

        const attributePromises = allAttributes.map(async (attr) => {
          const existingAttr = existingAttributes.find(
            (e) =>
              e.name === attr.name &&
              e.inventory_details_id.toString() === attr.inventory_details_id.toString()
          );

          let createdAttr;
          if (existingAttr) {
            // // console.log(
            //   `Updating attribute ${existingAttr._id} for inventory_details_id: ${attr.inventory_details_id}`
            // );
            createdAttr = await this.productRepo.updateInventoryDetailsAttributes(
              existingAttr._id,
              attr
            );
          } else {
            // console.log(
            //   `Creating new attribute for inventory_details_id: ${attr.inventory_details_id}`
            // );
            createdAttr = await this.productRepo.createInventoryDetailsAttributes(
              attr
            );
          }
          return createdAttr;
        });

        const createdAttributes = await Promise.all(attributePromises);
        // console.log(`Processed ${createdAttributes.length} attributes`);
      }

      return createdDetails;
    } catch (error) {
      // console.error(
      //   "Error in updateInventoryDetailsWithAttributes:",
      //   error.message,
      //   error.stack
      // );
      throw error;
    }
  }

  async deleteInventoryDetails(id) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.deleteInventoryDetails(id);
    } catch (error) {
      // console.error("Error in deleteInventoryDetails:", error.message);
      throw error;
    }
  }

  async deleteInventory(id) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.deleteInventory(id);
    } catch (error) {
      // console.error("Error in deleteInventory:", error.message);
      throw error;
    }
  }

  async deleteInventoryDetailsAttribute(id) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.deleteInventoryDetailsAttribute(id);
    } catch (error) {
      // console.error("Error in deleteInventoryDetailsAttribute:", error.message);
      throw error;
    }
  }

  async getProductsByAttribute(query) {
    try {
      await this.ensureMongooseConnection();

      const {
        page = 1,
        limit = 10,
        filters = "{}",
        searchFields = "{}",
        sort = "{}",
        attribute_name,
        attribute_value,
      } = query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const parsedFilters = JSON.parse(filters);
      const parsedSearchFields = JSON.parse(searchFields);
      const parsedSort = JSON.parse(sort);

      // Step 1: Match attributes
      const attributeFilter = {
        deletedAt: null,
      };

      if (attribute_name) attributeFilter.attribute_name = attribute_name;
      if (attribute_value) attributeFilter.attribute_value = attribute_value;

      const matchingAttributes = await ProductInventoryDetailAttribute.find(
        attributeFilter
      )
        .select("product_id")
        .lean();

      // console.log("Matching attributes:", matchingAttributes);

      const matchingProductIds = [
        ...new Set(matchingAttributes.map((attr) => String(attr.product_id))),
      ];

      // Step 2: Prepare product filter conditions
      let filterConditions = {
        deletedAt: null,
        _id: { $in: matchingProductIds },
        ...parsedFilters,
      };

      // Step 3: Add search fields as regex
      for (const [field, value] of Object.entries(parsedSearchFields)) {
        filterConditions[field] = { $regex: value, $options: "i" };
      }

      const skip = (pageNum - 1) * limitNum;

      // Step 4: Fetch products using filtered conditions
      const products = await this.productRepo.findAll(
        filterConditions,
        parsedSort,
        skip,
        limitNum
      );

      const totalCount = await this.productRepo.countDocuments(
        filterConditions
      );
      // console.log("filter conditions:", filterConditions);
      // console.log("Products fetched:", products);
      return {
        docs: products,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      };
    } catch (error) {
      // console.error("Error in getProductsByAttribute:", error.message);
      throw new AppError(
        "Cannot fetch products by attribute",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllProducts(query, user = null) {
    try {
      await this.ensureMongooseConnection();

      // Ensure query is an object
      const queryObj = query || {};
      const {
        page = 1,
        limit = 10,
        filters = "{}",
        searchFields = "{}",
        sort = "{}", // Default to empty object
        attributeFilters = "[]",
        // New query parameters
        include_category_ids,
        exclude_category_ids,
        in_stock,
        price_min,
        price_max,
        carat_min,
        carat_max,
        subcategory_id,
        sort_by,
        attribute_filters,
        gender,
        featured,
      } = queryObj;

      // Log all query parameters for debugging
      // console.log("=== getAllProducts Query Parameters ===");
      // console.log("include_category_ids:", include_category_ids);
      // console.log("exclude_category_ids:", exclude_category_ids);
      // console.log("in_stock:", in_stock, "type:", typeof in_stock);
      // console.log("page:", page, "limit:", limit);
      // console.log("========================================");

      // Helper function to safely parse JSON strings
      const safeJsonParse = (str, defaultValue = {}) => {
        if (!str || str === '' || str === 'undefined' || str === 'null') {
          return defaultValue;
        }
        try {
          return JSON.parse(str);
        } catch (e) {
          // console.warn(`Failed to parse JSON: ${str}, using default value`);
          return defaultValue;
        }
      };

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const parsedFilters = safeJsonParse(filters, {});
      const parsedSearchFields = safeJsonParse(searchFields, {});
      let parsedSort;

      // Handle string-based sort (e.g., "asc" or "desc")
      if (sort === "asc" || sort === "desc") {
        parsedSort = { createdAt: sort === "asc" ? 1 : -1 };
      } else {
        parsedSort = safeJsonParse(sort, {});
      }

      // Handle sort_by parameter (BEST, NEWEST, PRICE_LOW_TO_HIGH, PRICE_HIGH_TO_LOW)
      if (sort_by) {
        switch (sort_by) {
          case "BEST":
            parsedSort = { sold_count: -1 }; // Best sellers by sold count
            break;
          case "NEWEST":
            parsedSort = { createdAt: -1 }; // Newest first
            break;
          case "PRICE_LOW_TO_HIGH":
            parsedSort = { price: 1 }; // Price ascending
            break;
          case "PRICE_HIGH_TO_LOW":
            parsedSort = { price: -1 }; // Price descending
            break;
          default:
            // Keep existing parsedSort
            break;
        }
      }

      // Parse attribute_filters if provided (comma-separated string)
      let parsedAttributeFilters = safeJsonParse(attributeFilters, []);
      if (attribute_filters) {
        const attributeFilterArray = attribute_filters.split(",").map(f => f.trim());
        parsedAttributeFilters = [...parsedAttributeFilters, ...attributeFilterArray];
      }

      // Convert *_id filters to ObjectId
      for (const key in parsedFilters) {
        if (
          key.endsWith("_id") &&
          typeof parsedFilters[key] === "string" &&
          mongoose.Types.ObjectId.isValid(parsedFilters[key])
        ) {
          parsedFilters[key] = new mongoose.Types.ObjectId(parsedFilters[key]);
        }
      }

      // Build filter conditions for multiple fields
      const filterConditions = { deletedAt: null };
      // Role-based filtering
      if (user && user.role === 'vendor') {
        // Always use ObjectId for vendor filter
        const vendorId = user._id || user.id;
        filterConditions.vendor = mongoose.Types.ObjectId.isValid(vendorId)
          ? new mongoose.Types.ObjectId(vendorId)
          : vendorId;
      } else if (user && (user.role === 'admin' || user.role === 'superadmin')) {
        // Admin/superadmin sees all, no vendor filter
      } else if (user && user.role === 'user') {
        // User: only active products, not deleted, and not vendor-specific (global/admin products)
        filterConditions.status = 'active';
        filterConditions.vendor = null;
        // Only approved products are visible to general users
        filterConditions.is_approved = true;
      }
      else {
        // Public (no user): only active and approved global products
        filterConditions.status = 'active';
        filterConditions.is_approved = true;
      }
      // Merge in any additional filters
      Object.assign(filterConditions, parsedFilters);

      // Handle featured filter if provided
      if (featured !== undefined && featured !== null) {
        if (featured === "true" || featured === true) {
          filterConditions.featured = true;
        } else if (featured === "false" || featured === false) {
          filterConditions.featured = false;
        }
      }

      // Handle gender filter
      if (gender && gender !== 'both') {
        filterConditions.gender = gender;
      }

      // Handle include_category_ids (comma-separated string or array)
      if (include_category_ids) {
        const categoryIds = Array.isArray(include_category_ids)
          ? include_category_ids
          : include_category_ids.split(",").map(id => id.trim());
        // console.log("Parsed include_category_ids:", categoryIds);

        // Convert to ObjectIds - handle both ObjectId strings and numeric IDs
        const validCategoryIds = [];
        const numericIds = [];
        const nameOrSlugKeys = [];

        for (const id of categoryIds) {
          if (!id || id.trim() === '') continue;
          // Check if it's a valid ObjectId (24 chars)
          if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
            validCategoryIds.push(new mongoose.Types.ObjectId(id));
          } else if (!isNaN(id)) {
            // It's a numeric ID - map later
            numericIds.push(parseInt(id));
          } else {
            // Treat as a name/slug key
            nameOrSlugKeys.push(id);
          }
        }

        // Map numeric IDs to ObjectIds if any
        if (numericIds.length > 0) {
          try {
            const allCategories = await Category.find({ deletedAt: null }).sort({ createdAt: 1 }).lean();
            for (const numericId of numericIds) {
              const categoryIndex = numericId - 1;
              if (categoryIndex >= 0 && categoryIndex < allCategories.length) {
                const category = allCategories[categoryIndex];
                if (category && category._id) validCategoryIds.push(new mongoose.Types.ObjectId(category._id));
              }
            }
          } catch (mapError) {
            // ignore mapping errors
          }
        }

        // Resolve name/slug keys to ObjectIds in one query
        if (nameOrSlugKeys.length > 0) {
          try {
            const orQueries = [];
            for (const key of nameOrSlugKeys) {
              const regexStart = new RegExp(`^${key}`, 'i');
              const regexExact = new RegExp(`^${key}$`, 'i');
              orQueries.push({ slug: regexStart }, { name: regexExact });
            }
            const matchingCategories = await Category.find({ deletedAt: null, $or: orQueries }).lean();
            if (matchingCategories && matchingCategories.length > 0) {
              for (const c of matchingCategories) validCategoryIds.push(new mongoose.Types.ObjectId(c._id));
            }
          } catch (nameMapError) {
            // ignore
          }
        }

        // console.log("Valid include_category_ids (ObjectIds):", validCategoryIds);
        // console.log("Valid include_category_ids count:", validCategoryIds.length);
        if (validCategoryIds.length > 0) {
          filterConditions.category_id = { $in: validCategoryIds };
          // console.log("✅ Applied category filter:", JSON.stringify(filterConditions.category_id));
        } else {
          // console.warn("⚠️ No valid ObjectId category IDs found - category filter will be skipped");
          // console.warn("⚠️ This means ALL products will be returned (not filtered by category)");
        }
      }

      // Handle exclude_category_ids (comma-separated string or array)
      if (exclude_category_ids) {
        const categoryIds = Array.isArray(exclude_category_ids)
          ? exclude_category_ids
          : exclude_category_ids.split(",").map(id => id.trim());
        // console.log("Parsed exclude_category_ids:", categoryIds);

        // Convert to ObjectIds - handle both ObjectId strings and numeric IDs
        const validCategoryIds = [];
        const numericIds = [];

        for (const id of categoryIds) {
          // Check if it's a valid ObjectId (24 chars)
          if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
            validCategoryIds.push(new mongoose.Types.ObjectId(id));
          } else if (!isNaN(id) && id.trim() !== '') {
            // It's a numeric ID - we'll need to look it up
            numericIds.push(parseInt(id));
          } else {
            // console.log(`Exclude category ID "${id}" is not a valid ObjectId or numeric ID, skipping`);
          }
        }

        // If we have numeric IDs, try to map them to ObjectIds
        if (numericIds.length > 0) {
          try {
            const allCategories = await Category.find({ deletedAt: null }).sort({ createdAt: 1 }).lean();
            for (const numericId of numericIds) {
              const categoryIndex = numericId - 1;
              if (categoryIndex >= 0 && categoryIndex < allCategories.length) {
                const category = allCategories[categoryIndex];
                if (category && category._id) {
                  validCategoryIds.push(new mongoose.Types.ObjectId(category._id));
                  // console.log(`Mapped exclude numeric ID ${numericId} to ObjectId ${category._id}`);
                }
              }
            }
          } catch (mapError) {
            // console.error('Error mapping numeric exclude category IDs:', mapError.message);
          }
        }

        // console.log("Valid exclude_category_ids (ObjectIds):", validCategoryIds);
        if (validCategoryIds.length > 0) {
          if (filterConditions.category_id && filterConditions.category_id.$in) {
            // If we already have $in, filter out excluded IDs from the $in array
            const includeIds = filterConditions.category_id.$in;
            const filteredIncludeIds = includeIds.filter(id => {
              const idStr = id.toString();
              return !validCategoryIds.some(exId => exId.toString() === idStr);
            });
            if (filteredIncludeIds.length > 0) {
              filterConditions.category_id = { $in: filteredIncludeIds };
            } else {
              // All included categories are excluded, return empty
              return {
                docs: [],
                total: 0,
                page: pageNum,
                limit: limitNum,
                totalPages: 0,
              };
            }
          } else {
            filterConditions.category_id = {
              ...filterConditions.category_id,
              $nin: validCategoryIds,
            };
          }
        } else {
          // console.warn("No valid ObjectId exclude category IDs found - exclude filter will be skipped");
        }
      }

      // Handle subcategory_id
      if (subcategory_id && mongoose.Types.ObjectId.isValid(subcategory_id)) {
        filterConditions.subCategory_id = new mongoose.Types.ObjectId(subcategory_id);
      }

      // Handle price range filters
      if (price_min !== undefined) {
        const minPrice = parseFloat(price_min);
        if (!isNaN(minPrice)) {
          filterConditions.price = { ...filterConditions.price, $gte: minPrice };
        }
      }
      if (price_max !== undefined) {
        const maxPrice = parseFloat(price_max);
        if (!isNaN(maxPrice)) {
          filterConditions.price = { ...filterConditions.price, $lte: maxPrice };
        }
      }

      // Handle carat range filters (these are typically in attributes)
      // We'll handle this after attribute filtering

      // Build search conditions for multiple fields with partial matching
      for (const [field, value] of Object.entries(parsedSearchFields)) {
        filterConditions[field] = { $regex: value, $options: "i" };
      }

      // Handle in_stock filter - filter by inventory stock_status
      let inStockProductIds = null;
      // console.log("in_stock parameter:", in_stock, "type:", typeof in_stock);
      if (in_stock === "yes" || in_stock === true || in_stock === "true") {
        // console.log("Filtering for in-stock products...");

        // Query for inventories that are NOT out_of_stock
        // This includes: stock_status = "in_stock" OR stock_status is null/undefined (defaults to in_stock)
        const inStockInventories = await ProductInventory.find({
          $or: [
            { stock_status: "in_stock" },
            { stock_status: { $exists: false } }, // Field doesn't exist
            { stock_status: null }, // Field is null
            { stock_status: "" }, // Field is empty string
          ]
        }).select("product stock_status").lean();

        // console.log(`Found ${inStockInventories.length} inventories that are in stock`);

        // Also check what stock_status values exist in the database
        const allInventories = await ProductInventory.find({}).select("product stock_status").limit(10).lean();
        // console.log("Sample inventory stock_status values:", allInventories.map(inv => ({
        //   product: inv.product?.toString(),
        //   stock_status: inv.stock_status
        // })));

        // Get all product IDs that are NOT out_of_stock
        const outOfStockInventories = await ProductInventory.find({
          stock_status: "out_of_stock"
        }).select("product").lean();
        const outOfStockProductIds = new Set(
          outOfStockInventories.map(inv => {
            const productId = inv.product;
            return productId?.toString ? productId.toString() : String(productId);
          })
        );
        // console.log(`Found ${outOfStockProductIds.size} products that are out of stock`);

        // Convert product ObjectIds to strings - handle ObjectId properly
        inStockProductIds = inStockInventories
          .map(inv => {
            let productId = inv.product;
            // If it's an ObjectId, convert to string
            if (productId && typeof productId === 'object' && productId.toString) {
              productId = productId.toString();
            } else if (productId && typeof productId === 'string') {
              // Already a string
              productId = productId;
            } else {
              // Try to convert
              productId = String(productId);
            }
            return productId;
          })
          .filter(id => id && id !== 'undefined' && id !== 'null'); // Remove any invalid values

        // Remove duplicates
        inStockProductIds = [...new Set(inStockProductIds)];

        // console.log("In-stock product IDs (first 10):", inStockProductIds.slice(0, 10));
        // console.log("Total unique in-stock products:", inStockProductIds.length);

        if (inStockProductIds.length === 0) {
          // console.log("No products in stock, returning empty result");
          // No products in stock, return empty result
          return {
            docs: [],
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          };
        }
      } else {
        // console.log("in_stock filter not applied (value:", in_stock, ")");
      }

      // --- [NEW] Nested Variant-Level Filtering (AND between categories, OR within) ---
      const hasAttrFilters = Array.isArray(parsedAttributeFilters) && parsedAttributeFilters.length > 0;
      const hasCaratFilters = carat_min !== undefined || carat_max !== undefined;

      if (hasAttrFilters || hasCaratFilters) {
        // console.log("Applying nested filtering for:", {
        //   attributes: parsedAttributeFilters,
        //   carat: { min: carat_min, max: carat_max }
        // });

        // 1. Fetch all matching attribute records
        const attrRegexList = parsedAttributeFilters.map(v => new RegExp(`^${v}$`, "i"));
        const matches = await ProductInventoryDetailAttribute.find({
          $or: [
            { attribute_value: { $in: attrRegexList } },
            { attribute_name: { $regex: /carat/i } }
          ],
          deletedAt: null
        }).lean();

        // 2. Map matches to variants and identify required categories
        const variantMatches = {}; // vid -> Set of matched category names
        const vidToPid = {};
        const requiredAttrCategories = new Set();
        const matchedFilterValues = new Set();

        matches.forEach(m => {
          const vid = m.inventory_details_id?.toString();
          const pid = m.product_id?.toString();
          if (!vid || !pid) return;

          const name = (m.attribute_name || "").toLowerCase();
          const val = (m.attribute_value || "").toLowerCase();

          if (!variantMatches[vid]) variantMatches[vid] = new Set();
          vidToPid[vid] = pid;

          // Check direct attribute match
          if (parsedAttributeFilters.some(pf => pf.toLowerCase() === val)) {
            variantMatches[vid].add(name);
            requiredAttrCategories.add(name);
            matchedFilterValues.add(val);
          }

          // Check carat match
          if (name.includes("carat")) {
            const caratVal = parseFloat(val);
            const min = carat_min ? parseFloat(carat_min) : 0;
            const max = carat_max ? parseFloat(carat_max) : 999999;
            if (!isNaN(caratVal) && caratVal >= min && caratVal <= max) {
              variantMatches[vid].add("carat_category_internal");
              if (hasCaratFilters) requiredAttrCategories.add("carat_category_internal");
            }
          }
        });

        // 3. Verify all provided filters matched at least something
        const unmatchedFilters = parsedAttributeFilters.filter(f => !matchedFilterValues.has(f.toLowerCase()));
        if (unmatchedFilters.length > 0) {
          // console.log("Some filters had no matches in database:", unmatchedFilters);
          // If some attribute filters exist that literally don't exist in DB, no product can match them
          return {
            docs: [],
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          };
        }

        // 4. Find variants that match ALL required categories
        const matchingProductIds = new Set();
        for (const vid in variantMatches) {
          const matchedCatsForVariant = variantMatches[vid];
          // Must have matches in EVERY category that the user is filtering by
          const satisfiesAllCategories = Array.from(requiredAttrCategories).every(cat =>
            matchedCatsForVariant.has(cat)
          );

          if (satisfiesAllCategories) {
            matchingProductIds.add(vidToPid[vid]);
          }
        }

        // console.log(`Nested filter found ${matchingProductIds.size} products from ${Object.keys(variantMatches).length} candidate variants`);

        // 5. Combine with in_stock and apply to filterConditions
        let finalIds = Array.from(matchingProductIds);
        if (inStockProductIds !== null) {
          finalIds = finalIds.filter(id => inStockProductIds.includes(id));
          // console.log(`Combining with in-stock: ${matchingProductIds.size} -> ${finalIds.length}`);
        }

        if (finalIds.length === 0) {
          return {
            docs: [],
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          };
        }

        filterConditions._id = { $in: finalIds.map(id => new mongoose.Types.ObjectId(id)) };
      } else if (inStockProductIds !== null) {
        // Only in_stock filter, no attribute/carat filters
        const inStockObjectIds = inStockProductIds
          .map(id => {
            try {
              if (mongoose.Types.ObjectId.isValid(id)) {
                return new mongoose.Types.ObjectId(id);
              }
              return null;
            } catch (e) {
              return null;
            }
          })
          .filter(id => id !== null);

        if (inStockObjectIds.length === 0) {
          return {
            docs: [],
            total: 0,
            page: pageNum,
            limit: limitNum,
            totalPages: 0,
          };
        }
        filterConditions._id = { $in: inStockObjectIds };
      }

      const skip = (pageNum - 1) * limitNum;

      // console.log("=== FINAL FILTER CONDITIONS ===");
      // console.log(JSON.stringify(filterConditions, null, 2));
      // console.log("inStockProductIds count:", inStockProductIds ? inStockProductIds.length : null);
      // console.log("Skip:", skip, "Limit:", limitNum);
      // console.log("Sort:", parsedSort);
      // console.log("=================================");

      const products = await this.productRepo.findAll(
        filterConditions,
        parsedSort,
        skip,
        limitNum
      );

      // console.log(`✅ Fetched ${products.length} products from database`);
      if (products.length === 0 && filterConditions.category_id) {
        // console.warn("⚠️ No products found with category filter. Checking if products exist without category filter...");
        // Check if any products exist at all
        const totalProducts = await this.productRepo.countDocuments({ deletedAt: null });
        // console.log(`Total products in database (not deleted): ${totalProducts}`);
        // Check if products exist with this category_id
        const productsWithCategory = await this.productRepo.countDocuments({
          category_id: filterConditions.category_id,
          deletedAt: null
        });
        // console.log(`Products with category_id ${JSON.stringify(filterConditions.category_id)}: ${productsWithCategory}`);
      }

      const totalCount = await this.productRepo.countDocuments(filterConditions);
      // console.log(`Total count: ${totalCount}`);

      return {
        docs: products,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      };
    } catch (error) {
      // console.error("❌ Error in getAllProducts:", error.message);
      throw new AppError(
        "Cannot fetch products",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
  async getProductById(id) {
    try {
      await this.ensureMongooseConnection();
      // // console.log("Get Product by ID:", categoryId, productSlug);

      //fetch category by ID
      // const id = new mongoose.Types.ObjectId(categoryId);

      const product = await this.productRepo.findById(id);
      if (!product)
        throw new AppError("Product not found", StatusCodes.NOT_FOUND);

      //inventoryDetail of product
      const inventoryDetails = await ProductInventoryDetailAttribute.find({
        product: product?._id,
      }).populate("inventory_details_id");

      // console.log("Inventory details found:", inventoryDetails.length);

      return product;
    } catch (error) {
      // console.log("Error in getProductById:", error.message);
      throw error;
    }
  }

  // async getProductByIdAndSlug(categorySlug, productSlug, id) {
  //   try {
  //     await this.ensureMongooseConnection();

  //     let productQuery = {
  //       slug: productSlug,
  //       deletedAt: null,
  //     };

  //     // If categorySlug is provided, validate the category
  //     if (categorySlug) {
  //       const category = await Category.findOne({
  //         slug: categorySlug,
  //         deletedAt: null,
  //       }).lean();
  //       if (!category) {
  //         throw new AppError("Category not found", StatusCodes.NOT_FOUND);
  //       }
  //       productQuery.category_id = category._id;
  //     }

  //     // If id is provided, add it to the query
  //     if (id && mongoose.Types.ObjectId.isValid(id)) {
  //       productQuery._id = id;
  //     }

  //     // Fetch product with populated fields
  //     const product = await Product.findOne(productQuery)
  //       .populate('category_id', 'name slug')
  //       .populate('subCategory_id', 'name slug')
  //       .populate('brand', 'name slug')
  //       .lean();

  //     if (!product) {
  //       throw new AppError("Product not found", StatusCodes.NOT_FOUND);
  //     }

  //     // Fetch related inventory
  //     const inventories = await ProductInventory.find({
  //       product: product._id,
  //       deletedAt: null,
  //     }).lean();

  //     const inventoryIds = inventories.map((inv) => inv._id);

  //     // Fetch inventory details
  //     const inventoryDetails = await ProductInventoryDetail.find({
  //       product_id: product._id,
  //       product_inventory_id: { $in: inventoryIds },
  //       deletedAt: null,
  //     })
  //       .populate('size', 'name')
  //       .populate('color', 'name') // Uncomment if color population is needed
  //       .lean();

  //     const detailIds = inventoryDetails.map((d) => d._id);

  //     // Fetch attributes
  //     const attributes = await ProductInventoryDetailAttribute.find({
  //       product_id: product._id,
  //       inventory_details_id: { $in: detailIds },
  //       deletedAt: null,
  //     }).lean();

  //     // Group attributes by inventory_details_id
  //     const groupedAttributes = {};
  //     for (const attr of attributes) {
  //       const key = attr.inventory_details_id.toString();
  //       if (!groupedAttributes[key]) groupedAttributes[key] = [];
  //       groupedAttributes[key].push(attr);
  //     }

  //     // Prepare frontend-mapped data
  //     let available_attributes = {};
  //     let product_inventory_set = [];
  //     let additional_info_store = {};

  //     for (const detail of inventoryDetails) {
  //       const detailId = detail._id.toString();
  //       const detailAttrs = groupedAttributes[detailId] || [];
  //       const itemSet = {};

  //       for (const attr of detailAttrs) {
  //         const title = attr.attribute_name;
  //         const value = attr.attribute_value;
  //         const pid_id = attr._id.toString();

  //         // Resolve term image from ProductAttribute
  //         const attrDef = await ProductAttribute.findOne({ title }).lean();
  //         let image = "";
  //         if (attrDef) {
  //           let terms = [];
  //           let images = [];

  //           try {
  //             terms = Array.isArray(attrDef.terms)
  //               ? attrDef.terms
  //               : typeof attrDef.terms === "string"
  //               ? JSON.parse(attrDef.terms)
  //               : [];
  //           } catch (e) {
  //             // console.warn("Failed to parse terms:", attrDef.terms, e.message);
  //             terms = [];
  //           }

  //           try {
  //             images = Array.isArray(attrDef.images)
  //               ? attrDef.images
  //               : typeof attrDef.images === "string"
  //               ? JSON.parse(attrDef.images)
  //               : [];
  //           } catch (e) {
  //             // console.warn("Failed to parse images:", attrDef.images, e.message);
  //             images = [];
  //           }

  //           const idx = terms.indexOf(value);
  //           image = images[idx] || "";
  //         }

  //         if (!available_attributes[title]) available_attributes[title] = {};
  //         available_attributes[title][value] = { term: value, image, pid_id };

  //         itemSet[title] = value;
  //       }

  //       if (detail.color?.name) itemSet["ColorCode"] = detail.color.name;
  //       if (detail.size?.name) itemSet["Size"] = detail.size.name;

  //       const sortedSet = Object.fromEntries(Object.entries(itemSet).sort());
  //       const hash = md5(JSON.stringify(sortedSet));

  //       product_inventory_set.push(itemSet);

  //       additional_info_store[hash] = {
  //         pid_id: detail._id,
  //         additional_price: detail.additional_price,
  //         stock_count: detail.stock_count,
  //         image: detail.image || [],
  //       };
  //     }

  //     // Attach inventory to product
  //     product.inventory = inventories.length
  //       ? { inventory_details: inventoryDetails }
  //       : null;

  //     return {
  //       product,
  //       available_attributes,
  //       product_inventory_set,
  //       additional_info_store,
  //     };
  //   } catch (error) {
  //     // console.error("Error in getProductByIdAndSlug:", error.message);
  //     throw error;
  //   }
  // }

  async getProductByIdAndSlug(categorySlug, productSlug, id) {
    try {
      await this.ensureMongooseConnection();
      // console.log("MongoDB connection established.");

      let productQuery = {
        slug: productSlug,
        deletedAt: null,
      };

      if (categorySlug && !["products", "all", ":category"].includes(categorySlug.toLowerCase())) {
        const category = await Category.findOne({
          slug: categorySlug,
          deletedAt: null,
        }).lean();
        if (!category) {
          throw new AppError("Category not found", StatusCodes.NOT_FOUND);
        }
        productQuery.category_id = category._id;
        // console.log("Category found:", category);
      }

      if (id && mongoose.Types.ObjectId.isValid(id)) {
        productQuery._id = id;
      }

      const product = await Product.findOne(productQuery)
        .populate("category_id", "name slug")
        .populate("subCategory_id", "name slug")
        .populate("brand", "name slug")
        .lean();

      if (!product) {
        throw new AppError("Product not found", StatusCodes.NOT_FOUND);
      }

      // console.log("Product fetched:", product);

      const inventories = await ProductInventory.find({
        product: product._id,
        deletedAt: null,
      }).lean();

      // console.log("Inventories:", inventories);

      const inventoryIds = inventories.map((inv) => inv._id);

      let inventoryDetails = await ProductInventoryDetail.find({
        product_id: product._id,
        product_inventory_id: { $in: inventoryIds },
        deletedAt: null,
      })
        .populate("size", "name")
        .lean();

      const detailIds = inventoryDetails.map((d) => d.color);
      // console.log("Detail IDs for color:", detailIds);
      const attributes = await ProductAttribute.find({
        title: "METAL TYPE",
      });
      // console.log("Attributes fetched:", attributes);

      const metalTypes = detailIds.map((d) => {
        if (!attributes || attributes.length === 0 || !attributes[0].terms || !Array.isArray(attributes[0].terms)) {
          return null;
        }
        const it = attributes[0]?.terms?.filter((term) => {
          return term._id?.toString() === d?.toString();
        })[0];

        return it;
      });

      // console.log("fetched metal types:", metalTypes);

      inventoryDetails = inventoryDetails.map((detail) => {
        let check = metalTypes.find((metal) => {
          return metal?._id?.toString() === detail.color?.toString();
        });

        if (check) {
          detail.color = check;
        }
        return detail;
      });

      // console.log("Inventory details fetched:", inventoryDetails);

      // Fetch all product attributes (including properties like Metal Type)
      const allProductAttributes = await ProductInventoryDetailAttribute.find({
        product_id: product._id,
        deletedAt: null,
      }).lean();

      // console.log("All product attributes fetched:", allProductAttributes.length);

      const groupedAttributes = {};
      for (const attr of allProductAttributes) {
        const key = attr.inventory_details_id?.toString();
        if (!groupedAttributes[key]) groupedAttributes[key] = [];
        groupedAttributes[key].push(attr);
      }

      // Group attributes by attribute_name for product-level properties
      const productLevelAttributes = {};
      allProductAttributes.forEach(attr => {
        if (!productLevelAttributes[attr.attribute_name]) {
          productLevelAttributes[attr.attribute_name] = [];
        }
        productLevelAttributes[attr.attribute_name].push(attr.attribute_value);
      });

      let available_attributes = {};
      let product_inventory_set = [];
      let additional_info_store = {};

      // Add product-level properties to available_attributes
      Object.keys(productLevelAttributes).forEach(attrName => {
        const values = [...new Set(productLevelAttributes[attrName])]; // Remove duplicates
        if (!available_attributes[attrName]) {
          available_attributes[attrName] = {};
        }
        values.forEach(value => {
          if (!available_attributes[attrName][value]) {
            available_attributes[attrName][value] = { term: value, image: "", pid_id: "" };
          }
        });
      });

      for (const detail of inventoryDetails) {
        const detailId = detail._id?.toString();
        const detailAttrs = groupedAttributes[detailId] || [];
        const itemSet = {};

        for (const attr of detailAttrs) {
          const title = attr.attribute_name;
          const value = attr.attribute_value;
          const pid_id = attr._id?.toString();

          const attrDef = await ProductAttribute.findOne({ title }).lean();
          let image = "";
          if (attrDef) {
            let terms = [];
            let images = [];

            try {
              terms = Array.isArray(attrDef.terms)
                ? attrDef.terms
                : typeof attrDef.terms === "string"
                  ? JSON.parse(attrDef.terms)
                  : [];
            } catch (e) {
              // console.warn("Failed to parse terms:", attrDef.terms, e.message);
              terms = [];
            }

            try {
              images = Array.isArray(attrDef.images)
                ? attrDef.images
                : typeof attrDef.images === "string"
                  ? JSON.parse(attrDef.images)
                  : [];
            } catch (e) {
              // console.warn(
              //   "Failed to parse images:",
              //   attrDef.images,
              //   e.message
              // );
              images = [];
            }

            const idx = terms.indexOf(value);
            image = images[idx] || "";
          }

          if (!available_attributes[title]) available_attributes[title] = {};
          available_attributes[title][value] = { term: value, image, pid_id };

          itemSet[title] = value;
        }

        const metalAttr = detailAttrs.find((a) =>
          ["metal type", "metal_type", "MetalType"].includes(
            a.attribute_name?.toLowerCase()
          )
        );

        if (metalAttr) {
          const title = metalAttr.attribute_name;
          const value = metalAttr.attribute_value;
          const pid_id = metalAttr._id?.toString();

          const attrDef = await ProductAttribute.findOne({ title }).lean();
          let image = "";
          if (attrDef) {
            let terms = [];
            let images = [];

            try {
              terms = Array.isArray(attrDef.terms)
                ? attrDef.terms
                : typeof attrDef.terms === "string"
                  ? JSON.parse(attrDef.terms)
                  : [];
            } catch (e) {
              // console.warn(
              //   "Failed to parse metal terms:",
              //   attrDef.terms,
              //   e.message
              // );
              terms = [];
            }

            try {
              images = Array.isArray(attrDef.images)
                ? attrDef.images
                : typeof attrDef.images === "string"
                  ? JSON.parse(attrDef.images)
                  : [];
            } catch (e) {
              // console.warn(
              //   "Failed to parse metal images:",
              //   attrDef.images,
              //   e.message
              // );
              images = [];
            }

            const idx = terms.indexOf(value);
            image = images[idx] || "";
          }

          if (!available_attributes[title]) available_attributes[title] = {};
          available_attributes[title][value] = { term: value, image, pid_id };

          itemSet["ColorCode"] = value;
        }

        if (detail.size?.name) itemSet["Size"] = detail.size.name;

        const sortedSet = Object.fromEntries(Object.entries(itemSet).sort());
        const hash = md5(JSON.stringify(sortedSet));

        product_inventory_set.push(itemSet);

        additional_info_store[hash] = {
          pid_id: detail._id,
          additional_price: detail.additional_price,
          stock_count: detail.stock_count,
          image: detail.image || [],
        };
      }

      product.inventory = inventories.length
        ? { inventory_details: inventoryDetails }
        : null;

      // Add properties object to product for easy access
      const properties = {};
      Object.keys(productLevelAttributes).forEach(attrName => {
        const values = productLevelAttributes[attrName];
        if (values.length > 0) {
          // Use the first value as the property value (or join if multiple)
          properties[attrName] = values[0];
        }
      });
      product.properties = properties;

      // console.log("Available attributes:", available_attributes);
      // console.log("Product properties:", properties);
      // console.log("Product inventory set:", product_inventory_set.length);

      return {
        product,
        available_attributes,
        product_inventory_set,
        additional_info_store,
      };
    } catch (error) {
      // console.error("Error in getProductByIdAndSlug:", error.message);
      throw error;
    }
  }

  async findByName(title) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.findByName(title);
    } catch (error) {
      // console.error("Error in findByName:", error.message);
      throw error;
    }
  }

  async updateInventory(productId, data) {
    try {
      await this.ensureMongooseConnection();
      // console.log("Update Inventory data for product:", productId, data);
      // console.log("Stock status in data:", data.stock_status);
      // console.log("Manage stock in data:", data.manage_stock);
      const inventory = await ProductInventory.findOne({ product: productId });
      if (!inventory)
        throw new AppError("Inventory not found", StatusCodes.NOT_FOUND);

      // Ensure SKU is not set to null/empty - generate one if needed
      if (data.sku !== undefined) {
        if (!data.sku || !data.sku.trim()) {
          data.sku = `SKU-${productId}-${Date.now()}`;
        } else {
          data.sku = data.sku.trim();
        }
      }

      // Explicitly set all fields to ensure they're updated
      if (data.stock_count !== undefined) {
        inventory.stock_count = data.stock_count;
        inventory.markModified('stock_count');
      }
      if (data.stock_status !== undefined) {
        inventory.stock_status = data.stock_status;
        inventory.markModified('stock_status');
      }
      if (data.manage_stock !== undefined) {
        inventory.manage_stock = data.manage_stock;
        inventory.markModified('manage_stock');
      }
      if (data.lowStockThreshold !== undefined) {
        inventory.lowStockThreshold = data.lowStockThreshold;
        inventory.markModified('lowStockThreshold');
      }
      if (data.sku !== undefined) {
        inventory.sku = data.sku;
        inventory.markModified('sku');
      }

      // console.log("Inventory before save:", {
      //   stock_status: inventory.stock_status,
      //   manage_stock: inventory.manage_stock,
      //   stock_count: inventory.stock_count,
      //   lowStockThreshold: inventory.lowStockThreshold
      // });

      const saved = await inventory.save();
      // console.log("Inventory after save:", {
      //   stock_status: saved.stock_status,
      //   manage_stock: saved.manage_stock,
      //   stock_count: saved.stock_count,
      //   lowStockThreshold: saved.lowStockThreshold
      // });
      return saved;
    } catch (error) {
      // console.error("Error in updateInventory:", error.message);
      throw error;
    }
  }

  async updateInventoryDetails(id, data) {
    try {
      await this.ensureMongooseConnection();
      // console.log("Update Inventory Details data:", id, data);
      return await this.productRepo.updateInventoryDetails(id, data);
    } catch (error) {
      // console.error("Error in updateInventoryDetails:", error.message);
      throw error;
    }
  }

  async updateInventoryDetailsAttributes(id, data) {
    try {
      await this.ensureMongooseConnection();
      // console.log("Update Inventory Details Attributes data:", id, data);
      return await this.productRepo.updateInventoryDetailsAttributes(id, data);
    } catch (error) {
      // // console.error(
      //   "Error in updateInventoryDetailsAttributes:",
      //   error.message
      // );
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await this.ensureMongooseConnection();
      const deleted = await this.productRepo.softDelete(id);
      if (!deleted)
        throw new AppError("Product not found", StatusCodes.NOT_FOUND);
      return deleted;
    } catch (error) {
      // // console.error("Error in deleteProduct:", error.message);
      throw error;
    }
  }
}

export default ProductService;
