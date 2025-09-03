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
      console.log("Mongoose connection not ready, attempting to connect...");
      try {
        await mongoose.connect(process.env.MONGODB_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Mongoose connection established");
      } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
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
      console.log("Create Product data:", data);
      return await this.productRepo.create(data);
    } catch (error) {
      console.error("Error in createProduct:", error.message);
      throw error;
    }
  }

  async createInventory(data) {
    try {
      await this.ensureMongooseConnection();
      console.log("Create Inventory data:", data);
      return await this.productRepo.createInventory(data);
    } catch (error) {
      console.error("Error in createInventory:", error.message);
      throw error;
    }
  }

  async createInventoryDetails(data) {
    try {
      await this.ensureMongooseConnection();
      console.log("Create Inventory Details data:", data);
      return await this.productRepo.createInventoryDetails(data);
    } catch (error) {
      console.error("Error in createInventoryDetails:", error.message);
      throw error;
    }
  }

  async createInventoryDetailsAttributes(data) {
    try {
      await this.ensureMongooseConnection();
      console.log("Create Inventory Details Attributes data:", data);
      return await this.productRepo.createInventoryDetailsAttributes(data);
    } catch (error) {
      console.error(
        "Error in createInventoryDetailsAttributes:",
        error.message
      );
      throw error;
    }
  }

  async batchCreateInventoryDetails(dataArray) {
    try {
      await this.ensureMongooseConnection();
      console.log("Batch Create Inventory Details:", dataArray.length, "items");
      const promises = dataArray.map((data) =>
        this.productRepo.createInventoryDetails(data)
      );
      const results = await Promise.all(promises);
      console.log("Batch created inventory details:", results.length);
      return results;
    } catch (error) {
      console.error("Error in batchCreateInventoryDetails:", error.message);
      throw error;
    }
  }

  async batchCreateInventoryDetailsAttributes(dataArray) {
    try {
      await this.ensureMongooseConnection();
      console.log(
        "Batch Create Inventory Details Attributes:",
        dataArray.length,
        "items"
      );
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
      console.log("Batch created attributes:", results.flat().length);
      return results.flat();
    } catch (error) {
      console.error(
        "Error in batchCreateInventoryDetailsAttributes:",
        error.message
      );
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
      console.error(
        "Error in createInventoryDetailsWithAttributes:",
        error.message
      );
      throw error;
    }
  }

 async updateProduct(id, data, files = {}) {
  try {
    await this.ensureMongooseConnection();
    console.log("Update Product data:", data);
    const { mainImage, itemVariants } = files;

    console.log("Files received for update:", files);

    console.log("Main image:", id);

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

    console.log("Updated product data:", updatedData);
    const updatedProduct = await this.productRepo.update(id, updatedData);
    console.log("final updatedProduct:", updatedProduct);
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

      let updatedInventory;
      if (inventory) {
        updatedInventory = await this.productRepo.updateInventory(
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
        updatedInventory = await this.productRepo.createInventory(newInventoryData);
      }
    }

    // Update inventory details and attributes if provided
    if (itemVariants && itemVariants.length > 0) {
      await this.updateInventoryDetailsWithAttributes(id, itemVariants);
    }

    return updatedProduct;
  } catch (error) {
    console.log("Error in updateProduct:", error.message, error.stack);
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

      console.log("Variant details : ==> " + inventoryDetailsId, variantData);

      // Handle image upload
      let imageUrl = "";
      if (image && image instanceof File) {
        validateImageFile(image);
        imageUrl = await saveFile(
          image,
          "products",
          `item_${productId}_${inventoryDetailsId || Date.now()}`
        );
        console.log("Variant image updated:", imageUrl);
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
        console.log(
          "Fetching existing attributes for inventory_details_id:",
          createdDetails.map((d) => d._id)
        );
        existingAttributes = await ProductInventoryDetailAttribute.find({
          inventory_details_id: { $in: createdDetails.map((d) => d._id) },
        }).lean();
        console.log("Fetched existing attributes:", existingAttributes.length);
      } catch (error) {
        console.error(
          "Error fetching existing attributes:",
          error.message,
          error.stack
        );
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
          console.log(
            `Updating attribute ${existingAttr._id} for inventory_details_id: ${attr.inventory_details_id}`
          );
          createdAttr = await this.productRepo.updateInventoryDetailsAttributes(
            existingAttr._id,
            attr
          );
        } else {
          console.log(
            `Creating new attribute for inventory_details_id: ${attr.inventory_details_id}`
          );
          createdAttr = await this.productRepo.createInventoryDetailsAttributes(
            attr
          );
        }
        return createdAttr;
      });

      const createdAttributes = await Promise.all(attributePromises);
      console.log(`Processed ${createdAttributes.length} attributes`);
    }

    return createdDetails;
  } catch (error) {
    console.error(
      "Error in updateInventoryDetailsWithAttributes:",
      error.message,
      error.stack
    );
    throw error;
  }
}

  async deleteInventoryDetails(id) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.deleteInventoryDetails(id);
    } catch (error) {
      console.error("Error in deleteInventoryDetails:", error.message);
      throw error;
    }
  }

  async deleteInventory(id) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.deleteInventory(id);
    } catch (error) {
      console.error("Error in deleteInventory:", error.message);
      throw error;
    }
  }

  async deleteInventoryDetailsAttribute(id) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.deleteInventoryDetailsAttribute(id);
    } catch (error) {
      console.error("Error in deleteInventoryDetailsAttribute:", error.message);
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

      console.log("Matching attributes:", matchingAttributes);

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
      console.log("filter conditions:", filterConditions);
      console.log("Products fetched:", products);
      return {
        docs: products,
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum),
      };
    } catch (error) {
      console.error("Error in getProductsByAttribute:", error.message);
      throw new AppError(
        "Cannot fetch products by attribute",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

async getAllProducts(query) {
  try {
    await this.ensureMongooseConnection();

    const {
      page = 1,
      limit = 10,
      filters = "{}",
      searchFields = "{}",
      sort = "{}", // Default to empty object
      attributeFilters = "[]",
    } = query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const parsedFilters = JSON.parse(filters);
    const parsedSearchFields = JSON.parse(searchFields);
    let parsedSort;

    // Handle string-based sort (e.g., "asc" or "desc")
    if (sort === "asc" || sort === "desc") {
      parsedSort = { createdAt: sort === "asc" ? 1 : -1 }; // Default to sorting by createdAt
    } else {
      parsedSort = JSON.parse(sort); // Existing JSON parsing for {"field":1} format
    }

    const parsedAttributeFilters = JSON.parse(attributeFilters);

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

    let filterConditions = { ...parsedFilters };

    // Apply text search filters
    for (const [field, value] of Object.entries(parsedSearchFields)) {
      filterConditions[field] = { $regex: value, $options: "i" };
    }

    // Handle attribute value-only filtering
    if (Array.isArray(parsedAttributeFilters) && parsedAttributeFilters.length > 0) {
      const attributeRegexList = parsedAttributeFilters.map(
        (val) => new RegExp(`^${val}$`, "i")
      );

      const matchingAttributes = await ProductInventoryDetailAttribute.find({
        attribute_value: { $in: attributeRegexList },
        deletedAt: null,
      }).select("product_id");

      const productIds = [
        ...new Set(matchingAttributes.map((item) => item.product_id.toString())),
      ];

      console.log("📦 Matching product IDs from attribute values:", productIds);

      if (productIds.length === 0) {
        return {
          docs: [],
          total: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
        };
      }

      filterConditions._id = { $in: productIds };
    }

    const skip = (pageNum - 1) * limitNum;

    console.log("📦 FINAL FILTER CONDITIONS:", filterConditions);

    const products = await this.productRepo.findAll(
      filterConditions,
      parsedSort,
      skip,
      limitNum
    );
    const totalCount = await this.productRepo.countDocuments(filterConditions);

    return {
      docs: products,
      total: totalCount,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalCount / limitNum),
    };
  } catch (error) {
    console.error("❌ Error in getAllProducts:", error.message);
    throw new AppError(
      "Cannot fetch products",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
  async getProductById(id) {
    try {
      await this.ensureMongooseConnection();
      // console.log("Get Product by ID:", categoryId, productSlug);

      //fetch category by ID
      // const id = new mongoose.Types.ObjectId(categoryId);

      const product = await this.productRepo.findById(id);
      if (!product)
        throw new AppError("Product not found", StatusCodes.NOT_FOUND);

      //inventoryDetail of product
      const inventoryDetails = await ProductInventoryDetailAttribute.find({
        product: product?._id,
      }).populate("inventory_details_id");

      console.log("Inventory details found:", inventoryDetails.length);

      return product;
    } catch (error) {
      console.log("Error in getProductById:", error.message);
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
  //             console.warn("Failed to parse terms:", attrDef.terms, e.message);
  //             terms = [];
  //           }

  //           try {
  //             images = Array.isArray(attrDef.images)
  //               ? attrDef.images
  //               : typeof attrDef.images === "string"
  //               ? JSON.parse(attrDef.images)
  //               : [];
  //           } catch (e) {
  //             console.warn("Failed to parse images:", attrDef.images, e.message);
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
  //     console.error("Error in getProductByIdAndSlug:", error.message);
  //     throw error;
  //   }
  // }

  async getProductByIdAndSlug(categorySlug, productSlug, id) {
    try {
      await this.ensureMongooseConnection();
      console.log("MongoDB connection established.");

      let productQuery = {
        slug: productSlug,
        deletedAt: null,
      };

      if (categorySlug) {
        const category = await Category.findOne({
          slug: categorySlug,
          deletedAt: null,
        }).lean();
        if (!category) {
          throw new AppError("Category not found", StatusCodes.NOT_FOUND);
        }
        productQuery.category_id = category._id;
        console.log("Category found:", category);
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

      console.log("Product fetched:", product);

      const inventories = await ProductInventory.find({
        product: product._id,
        deletedAt: null,
      }).lean();

      console.log("Inventories:", inventories);

      const inventoryIds = inventories.map((inv) => inv._id);

      let inventoryDetails = await ProductInventoryDetail.find({
        product_id: product._id,
        product_inventory_id: { $in: inventoryIds },
        deletedAt: null,
      })
        .populate("size", "name")
        .lean();

      const detailIds = inventoryDetails.map((d) => d.color);
      console.log("Detail IDs for color:", detailIds);
      const attributes = await ProductAttribute.find({
        title: "METAL TYPE",
      });
      console.log("Attributes fetched:", attributes);

      const metalTypes = detailIds.map((d) => {
        const it = attributes[0]?.terms?.filter((term) => {
          return term._id?.toString() === d?.toString();
        })[0];

        return it;
      });

      console.log("fetched metal types:", metalTypes);

      inventoryDetails = inventoryDetails.map((detail) => {
        let check = metalTypes.find((metal) => {
          return metal?._id?.toString() === detail.color?.toString();
        });

        if (check) {
          detail.color = check;
        }
        return detail;
      });

      console.log("Inventory details fetched:", inventoryDetails);

      const groupedAttributes = {};
      for (const attr of attributes) {
        const key = attr.inventory_details_id?.toString();
        if (!groupedAttributes[key]) groupedAttributes[key] = [];
        groupedAttributes[key].push(attr);
      }

      let available_attributes = {};
      let product_inventory_set = [];
      let additional_info_store = {};

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
              console.warn("Failed to parse terms:", attrDef.terms, e.message);
              terms = [];
            }

            try {
              images = Array.isArray(attrDef.images)
                ? attrDef.images
                : typeof attrDef.images === "string"
                ? JSON.parse(attrDef.images)
                : [];
            } catch (e) {
              console.warn(
                "Failed to parse images:",
                attrDef.images,
                e.message
              );
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
              console.warn(
                "Failed to parse metal terms:",
                attrDef.terms,
                e.message
              );
              terms = [];
            }

            try {
              images = Array.isArray(attrDef.images)
                ? attrDef.images
                : typeof attrDef.images === "string"
                ? JSON.parse(attrDef.images)
                : [];
            } catch (e) {
              console.warn(
                "Failed to parse metal images:",
                attrDef.images,
                e.message
              );
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

      console.log("Available attributes:", available_attributes);
      console.log("Product inventory set:", product_inventory_set.length);

      return {
        product,
        available_attributes,
        product_inventory_set,
        additional_info_store,
      };
    } catch (error) {
      console.error("Error in getProductByIdAndSlug:", error.message);
      throw error;
    }
  }

  async findByName(title) {
    try {
      await this.ensureMongooseConnection();
      return await this.productRepo.findByName(title);
    } catch (error) {
      console.error("Error in findByName:", error.message);
      throw error;
    }
  }

  async updateInventory(productId, data) {
    try {
      await this.ensureMongooseConnection();
      console.log("Update Inventory data for product:", productId, data);
      const inventory = await ProductInventory.findOne({ product: productId });
      if (!inventory)
        throw new AppError("Inventory not found", StatusCodes.NOT_FOUND);

      inventory.set(data);
      return await inventory.save();
    } catch (error) {
      console.error("Error in updateInventory:", error.message);
      throw error;
    }
  }

  async updateInventoryDetails(id, data) {
    try {
      await this.ensureMongooseConnection();
      console.log("Update Inventory Details data:", id, data);
      return await this.productRepo.updateInventoryDetails(id, data);
    } catch (error) {
      console.error("Error in updateInventoryDetails:", error.message);
      throw error;
    }
  }

  async updateInventoryDetailsAttributes(id, data) {
    try {
      await this.ensureMongooseConnection();
      console.log("Update Inventory Details Attributes data:", id, data);
      return await this.productRepo.updateInventoryDetailsAttributes(id, data);
    } catch (error) {
      console.error(
        "Error in updateInventoryDetailsAttributes:",
        error.message
      );
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
      console.error("Error in deleteProduct:", error.message);
      throw error;
    }
  }
}

export default ProductService;
