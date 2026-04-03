import ProductService from "../services/productService.js";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  productCreateValidator,
  productUpdateValidator,
} from "../validators/productvalidation.js";
import initRedis from "../config/redis.js";
import { saveFile, validateImageFile } from "../lib/fileUpload.js";
import ProductInventoryDetailAttribute from "../models/ProductInventoryDetailAttribute.js";
import ProductInventory from "../models/ProductInventory.js";
import ProductInventoryDetails from "../models/ProductInventoryDetails.js";
import Product from "../models/Product.js";

const productService = new ProductService();
const redis = initRedis();

export async function createProduct(formData, user = null) {
  const startTime = Date.now();
  let product = null;
  const createdResources = [];

  try {
    const data = formData;

    // console.log("Starting product creation...");
    // console.log("Received form data:", data);

    // Step 1: Parse and validate all data upfront
    const { productData, inventoryData, itemVariants } = await parseFormData(
      data
    );

    if (formData.get("is_diamond")) {
      productData.is_diamond = formData.get("is_diamond") === "true";
    }
    // console.log("Parsed product data, including is_diamond:", productData);
    // console.log("Received form data:", itemVariants);


    // Step 2: Validate product data
    const { error, value } = productCreateValidator.validate(productData);
    if (error) {
      return {
        status: 400,
        body: errorResponse("Validation error", 400, error.details),
      };
    }

    // Step 3: Check for existing product using Redis cache first
    const cacheKey = `product:name:${value.name.toLowerCase()}`;
    // let existing = await redis.get(cacheKey);

    // if (!existing) {
    //     existing = await productService.findByName(value.name);
    //     if (existing) {
    //         await redis.setex(cacheKey, 3600, JSON.stringify(existing));
    //     }
    // } else {
    //     existing = JSON.parse(existing);
    // }

    // if (existing) {
    //     return {
    //         status: 400,
    //         body: errorResponse('Product with this name already exists', 400),
    //     };
    // }

    // Step 4: Process all file uploads in parallel
    const fileUploadPromises = [];
    let mainImageUrls = [];
    // console.log("Processing file uploads...");

    // Collect all possible image fields: "image", "image[0]", "image[1]", etc.
    const mainImages = [];

    // 1. Add all from data.getAll("image")
    const imagesFromGetAll = data.getAll("image");
    if (imagesFromGetAll && imagesFromGetAll.length > 0) {
      imagesFromGetAll.forEach((img) => {
        if (img && img instanceof File) mainImages.push(img);
      });
    }

    // 2. Add indexed images: image[0], image[1], ...
    let idx = 0;
    while (true) {
      const indexedImage = data.get(`images[${idx}]`);
      if (!indexedImage) break;
      if (indexedImage instanceof File) mainImages.push(indexedImage);
      idx++;
    }

    // 3. Remove duplicates (in case getAll("image") and image[0] overlap)
    const uniqueMainImages = Array.from(new Set(mainImages));

    uniqueMainImages.forEach((mainImage, idx) => {
      if (mainImage && mainImage instanceof File) {
        fileUploadPromises.push(
          processImageUpload(mainImage, "products", `main_${idx}`).then(
            (url) => {
              mainImageUrls.push(url);
            }
          )
        );
      }
    });

    const itemImagePromises = itemVariants.map((variant, index) => {
      if (variant.image && variant.image instanceof File) {
        return processImageUpload(
          variant.image,
          "products",
          `item_${index}`
        ).then((url) => {
          variant.processedImageUrl = url;
          return url;
        });
      }
      return Promise.resolve(null);
    });

    fileUploadPromises.push(...itemImagePromises);
    await Promise.all(fileUploadPromises);

    if (mainImageUrls.length > 0) {
      value.image = mainImageUrls;
    }

    // console.log("All images processed successfully:", value);


    // Set vendor if user is a vendor
    if (user && user.role === 'vendor') {
      value.vendor = user._id;
    }

    // Step 5: Create product
    // console.log("Product data to be stored, including is_diamond:", value);
    product = await productService.createProduct(value);

    if (!product || !product._id) {
      throw new Error("Failed to create product - product is undefined or missing _id");
    }

    createdResources.push({ type: "product", id: product._id });
    // console.log("Product created:", product._id);

    // Step 6: Create inventory record
    // Generate SKU if not provided to avoid duplicate key errors
    const sku = inventoryData.sku && inventoryData.sku.trim()
      ? inventoryData.sku.trim()
      : `SKU-${product._id}-${Date.now()}`;

    const inventory = {
      product: product._id,
      sku: sku,
      stock_count: inventoryData.stock_count || 0,
      sold_count: 0,
      stock_status: inventoryData.stock_status || 'in_stock',
      manage_stock: inventoryData.manage_stock || 'yes',
      lowStockThreshold: inventoryData.lowStockThreshold || 5,
    };

    const inventoryRecord = await productService.createInventory(inventory);

    if (!inventoryRecord || !inventoryRecord._id) {
      throw new Error("Failed to create inventory - inventoryRecord is undefined or missing _id");
    }

    createdResources.push({ type: "inventory", id: inventoryRecord._id });

    // Step 7: Batch create inventory details and attributes
    let inventoryDetails = [];
    let inventoryDetailAttributes = [];
    let shapeTermsMap = new Map(); // Declare outside to use in response mapping

    // console.log("Creating inventory details in batch...");
    // console.log("Item variants to process:", itemVariants.length);
    if (itemVariants.length > 0) {
      const detailsResult = await createInventoryDetailsInBatch(
        product._id,
        inventoryRecord._id,
        itemVariants,
        createdResources
      );
      inventoryDetails = detailsResult.inventoryDetails;
      inventoryDetailAttributes = detailsResult.attributes;

      // Fetch all attributes for all inventory details to ensure we have complete data
      if (inventoryDetails.length > 0) {
        const detailIds = inventoryDetails.map(d => d._id).filter(Boolean);
        if (detailIds.length > 0) {
          const allAttrs = await ProductInventoryDetailAttribute.find({
            inventory_details_id: { $in: detailIds },
            deletedAt: null,
          }).lean();
          // Replace with fetched attributes to ensure we have the latest data
          inventoryDetailAttributes = allAttrs;
        }
      }
    }

    // Fetch shape attribute terms once for all variants (optimization)
    try {
      const ProductAttribute = (await import("../models/productAttribute.js")).default;
      const shapeAttribute = await ProductAttribute.findOne({
        title: { $regex: /shape/i },
        deletedAt: null
      }).lean();

      if (shapeAttribute?.terms && Array.isArray(shapeAttribute.terms)) {
        shapeAttribute.terms.forEach(term => {
          const termId = term._id?.toString() || term.id?.toString();
          const termValue = term.value || term.name;
          if (termId) {
            shapeTermsMap.set(termId, term);
          }
          if (termValue) {
            shapeTermsMap.set(termValue, term);
          }
        });
      }
    } catch (error) {
      // console.error("Error fetching shape terms:", error);
    }

    // Step 8: Update Redis cache
    await updateProductCaches(product, value.name);

    const executionTime = Date.now() - startTime;
    // console.log(`Product creation completed in ${executionTime}ms`);

    // console.log(
    //   "inventory Details : " + JSON.stringify(inventoryDetails, null, 2)
    // );

    const propertyData = formData.get("properties");
    if (propertyData && inventoryDetails && inventoryDetails.length > 0 && inventoryDetails[0] && inventoryDetails[0]._id) {
      const actualData = JSON.parse(propertyData);

      const createAttributePromises = Object.keys(actualData).map((key) => {
        return ProductInventoryDetailAttribute.create({
          inventory_details_id: inventoryDetails[0]._id,
          product_id: product._id,
          attribute_name: key,
          attribute_value: actualData[key],
        });
      });

      await Promise.all(createAttributePromises);
    } else if (propertyData && (!inventoryDetails || inventoryDetails.length === 0)) {
      // console.warn("Properties data provided but no inventory details created. Skipping attribute creation.");
    }
    // Step 9: Construct response data
    const responseData = {
      name: product.name,
      slug: product.slug,
      summary: product.summary,
      category_id: product.category_id,
      subCategory_id: product.subCategory_id,
      description: product.description,
      image: product.image,
      price: product.price,
      saleprice: product.saleprice,
      cost: product.cost,
      badge_id: product.badge_id,
      brand_id: product.brand_id,
      status: product.status || "active",
      product_type: product.product_type,
      sold_count: product.sold_count || 0,
      min_purchase: product.min_purchase,
      max_purchase: product.max_purchase,
      is_refundable: product.is_refundable,
      is_in_house: product.is_in_house,
      is_inventory_warn_able: product.is_inventory_warn_able,
      admin_id: product.admin_id,
      vendor_id: product.vendor_id,
      isTaxable: product.isTaxable,
      taxClass: product.taxClass,
      is_diamond: product.is_diamond,
      deleted_at: product.deleted_at,
      _id: product._id,
      created_at: product.created_at,
      updated_at: product.updated_at,
      __v: product.__v,
      inventory: {
        _id: inventoryRecord._id,
        product: inventoryRecord.product,
        sku: inventoryRecord.sku,
        stock_count: inventoryRecord.stock_count,
        sold_count: inventoryRecord.sold_count,
        created_at: inventoryRecord.created_at,
        updated_at: inventoryRecord.updated_at,
        __v: inventoryRecord.__v,
        inventory_details: await Promise.all(inventoryDetails.map(async (detail) => {
          const detailAttributes = inventoryDetailAttributes
            .filter(
              (attr) =>
                (attr.inventory_details_id?.toString() || attr.inventory_details_id?._id?.toString() || "") ===
                detail._id.toString()
            )
            .map((attr) => ({
              _id: attr._id,
              inventory_details_id: attr.inventory_details_id?._id || attr.inventory_details_id,
              product_id: attr.product_id?._id || attr.product_id,
              name: attr.attribute_name || attr.name,
              value: attr.attribute_value || attr.value,
              created_at: attr.created_at,
              updated_at: attr.updated_at,
              __v: attr.__v,
            }));

          // Extract shape, carat, and metal type from attributes
          const shapeAttr = detailAttributes.find(attr =>
            (attr.name || "").toLowerCase() === "shape"
          );
          const caratAttr = detailAttributes.find(attr =>
            (attr.name || "").toLowerCase() === "carat"
          );
          const metalAttr = detailAttributes.find(attr => {
            const name = (attr.name || "").toLowerCase();
            return name.includes("metal") ||
              name === "metal type" ||
              name === "metaltype" ||
              name === "metatype";
          });

          // Metal type is stored in the color field (which is actually metal type ID)
          // Use metal attribute value if found, otherwise use color field
          const metalType = metalAttr?.value || detail.color || null;

          // Get shape image from pre-fetched shape terms map
          let shapeImage = null;
          if (shapeAttr?.value && shapeTermsMap.size > 0) {
            const shapeTerm = shapeTermsMap.get(shapeAttr.value);
            if (shapeTerm) {
              shapeImage = shapeTerm.image ||
                shapeTerm.icon ||
                shapeTerm.imageUrl ||
                shapeTerm.iconUrl ||
                shapeTerm.termImage ||
                shapeTerm.term_image ||
                shapeTerm.img ||
                shapeTerm.icon_url ||
                null;
            }
          }

          return {
            _id: detail._id,
            product_id: detail.product_id,
            product_inventory_id: detail.product_inventory_id,
            size: detail.size,
            color: detail.color,
            shape: shapeAttr?.value || null,
            shape_image: shapeImage,
            carat: caratAttr?.value || null,
            metal_type: metalType,
            additional_price: detail.additional_price,
            extra_cost: detail.add_cost || detail.extra_cost || 0,
            stock_count: detail.stock_count,
            image: detail.image,
            created_at: detail.created_at,
            updated_at: detail.updated_at,
            __v: detail.__v,
            attributes: detailAttributes,
          };
        })),
      },
      execution_time: executionTime,
    };

    return {
      status: 201,
      body: successResponse(
        responseData,
        "Product created successfully"
      ),
    };
  } catch (err) {
    // console.error("Create Product error:", err.message);
    // console.log("Error stack trace:", err.stack);
    if (createdResources.length > 0) {
      await cleanupCreatedResources(createdResources);
    }

    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

async function parseFormData(data) {
  const productData = {
    name: data.get("name"),
    category_id: data.get("category_id") || null,
    subCategory_id: data.get("subCategory_id") || null,
    gender: data.get("gender") || "both",
    slug:
      data.get("slug") ||
      (data.get("name")
        ? data.get("name").toLowerCase().replace(/\s+/g, "-")
        : ""),
    summary: data.get("summary"),
    description: data.get("description"),
    image: [],
    price: data.get("price") ? parseFloat(data.get("price")) : null,
    saleprice: data.get("saleprice") ? parseFloat(data.get("saleprice")) : null,
    cost: data.get("cost") ? parseFloat(data.get("cost")) : null,
    badge_id: data.get("badge_id") ? parseInt(data.get("badge_id")) : null,
    brand_id: data.get("brand") || null,
    product_type: 2,
    min_purchase: data.get("min_purchase")
      ? parseInt(data.get("min_purchase"))
      : null,
    max_purchase: data.get("max_purchase")
      ? parseInt(data.get("max_purchase"))
      : null,
    is_inventory_warn_able: !!data.get("is_inventory_warn_able"),
    is_refundable: !!data.get("is_refundable"),
    is_in_house: true,
    admin_id: 1,
    vendor_id: null,
    isTaxable: data.get("isTaxable"),
    taxClass: data.get("taxClass"),
  };

  const inventoryData = {
    sku: data.get("sku"),
    stock_count: parseInt(data.get("stockQuantity")) || parseInt(data.get("quantity")) || 0,
    stock_status: data.get("stockStatus") || 'in_stock',
    manage_stock: data.get("manageStock") || 'yes',
    lowStockThreshold: parseInt(data.get("lowStockThreshold")) || 5,
  };

  const itemVariants = [];

  // Helper function to get values from form data with bracket notation (e.g., item_size[0], item_size[1])
  const getBracketNotationValues = (baseName) => {
    const values = [];
    let index = 0;
    let consecutiveMissing = 0;
    const maxGap = 3;

    while (consecutiveMissing < maxGap) {
      const value = data.get(`${baseName}[${index}]`);
      if (value === null || value === undefined) {
        consecutiveMissing++;
        values.push(undefined);
      } else {
        values.push(value);
        consecutiveMissing = 0;
      }
      index++;
    }
    while (values.length > 0 && values[values.length - 1] === undefined) {
      values.pop();
    }
    return values;
  };

  // Get all variant field arrays using bracket notation
  const itemSizes = getBracketNotationValues("item_size");
  const itemColors = getBracketNotationValues("item_color");
  const itemShapes = getBracketNotationValues("item_shape");
  const itemCarats = getBracketNotationValues("item_carat");
  // Read additional_price and extra_cost separately (they are different fields)
  const itemAdditionalPrices = getBracketNotationValues("item_additional_price");
  const itemExtraCosts = getBracketNotationValues("item_extra_cost");
  const itemStockCounts = getBracketNotationValues("item_stock_count");
  const itemImages = getBracketNotationValues("item_image");

  // console.log("Parsed variant fields:", {
  //   itemSizes: itemSizes.length,
  //   itemColors: itemColors.length,
  //   itemShapes: itemShapes.length,
  //   itemCarats: itemCarats.length,
  //   itemAdditionalPrices: itemAdditionalPrices.length,
  //   itemExtraCosts: itemExtraCosts.length,
  //   itemStockCounts: itemStockCounts.length,
  //   itemImages: itemImages.length
  // });

  // Calculate max length across all variant fields
  const maxLength = Math.max(
    itemSizes.length,
    itemColors.length,
    itemShapes.length,
    itemCarats.length,
    itemAdditionalPrices.length,
    itemExtraCosts.length,
    itemStockCounts.length,
    itemImages.length
  );

  // console.log("Max length for variants:", maxLength);

  for (let itemIndex = 0; itemIndex < maxLength; itemIndex++) {
    const size = itemSizes[itemIndex];
    const color = itemColors[itemIndex];
    const shapeValue = itemShapes[itemIndex];
    const caratValue = itemCarats[itemIndex];

    const additionalPrice = itemAdditionalPrices[itemIndex] && !isNaN(parseFloat(itemAdditionalPrices[itemIndex])) ? parseFloat(itemAdditionalPrices[itemIndex]) : 0;
    const extra_cost = itemExtraCosts[itemIndex] && !isNaN(parseFloat(itemExtraCosts[itemIndex])) ? parseFloat(itemExtraCosts[itemIndex]) : 0;
    const stock_count = itemStockCounts[itemIndex] && !isNaN(parseInt(itemStockCounts[itemIndex])) ? parseInt(itemStockCounts[itemIndex]) : 0;
    const image = itemImages[itemIndex];

    // Skip if no meaningful variant fields are present
    if (!size && !color && !shapeValue && !caratValue && !additionalPrice && !extra_cost && !stock_count && !image) {
      continue;
    }

    // Read variant SKU from form data
    const sku = data.get(`item_sku[${itemIndex}]`) || "";

    const variant = {
      size: size || undefined,
      color: color || undefined,
      sku: sku,
      additional_price: additionalPrice,
      extra_cost: extra_cost,
      stock_count: stock_count,
      image: image || undefined,
      attributes: [],
    };


    // Add Shape attribute if present (ensure it's a valid string, not an array)
    if (shapeValue && typeof shapeValue === 'string' && shapeValue.trim() !== '') {
      variant.attributes.push({
        name: "Shape",
        value: shapeValue.trim(),
      });
    }

    // Add Carat attribute if present (ensure it's a valid string, not an array)
    if (caratValue && typeof caratValue === 'string' && caratValue.trim() !== '') {
      variant.attributes.push({
        name: "Carat",
        value: caratValue.trim(),
      });
    }

    let attrIndex = 0;

    while (true) {
      const attrName = data.get(`item_attribute_name[${itemIndex}][${attrIndex}]`);
      const attrValue = data.get(`item_attribute_value[${itemIndex}][${attrIndex}]`);
      if (attrName === null || attrName === undefined) break;

      variant.attributes.push({
        name: attrName,
        value: attrValue,
      });
      attrIndex++;
    }
    // console.log(`[DEBUG] Parsed attributes for item ${itemIndex}:`, variant.attributes);
    itemVariants.push(variant);
  }

  // console.log("Parsed product data:", itemVariants);

  return { productData, inventoryData, itemVariants };
}

async function processImageUpload(imageFile, folder, identifier) {
  try {
    validateImageFile(imageFile);
    // console.log(`Processing ${identifier} image:`, imageFile.name);
    const imageUrl = await saveFile(imageFile, folder);
    // console.log(`${identifier} image saved:`, imageUrl);
    return imageUrl;
  } catch (error) {
    // console.error(`${identifier} image upload failed:`, error.message);
    throw new Error(`${identifier} image upload error: ${error.message}`);
  }
}

async function createInventoryDetailsInBatch(
  productId,
  inventoryId,
  itemVariants,
  createdResources
) {
  const inventoryDetails = [];
  const allAttributes = [];

  itemVariants.forEach((variant, idx) => {
    const detail = {
      product_id: productId,
      product_inventory_id: inventoryId,
      size: variant.size,
      color: variant.color,
      additional_price: variant.additional_price,
      add_cost: variant.extra_cost || 0, // Schema field is 'add_cost'
      stock_count: variant.stock_count,
      sku: variant.sku || "",
      image: variant.processedImageUrl ? [variant.processedImageUrl] : [],
    };
    inventoryDetails.push(detail);

    if (Array.isArray(variant.attributes)) {
      variant.attributes.forEach((attr) => {
        allAttributes.push({
          inventory_detail_index: idx,
          attribute_name: attr.name,
          attribute_value: attr.value,
          product_id: productId,
        });
      });
    }
  });

  const createdDetails = await productService.batchCreateInventoryDetails(
    inventoryDetails
  );
  createdDetails.forEach((detail) => {
    createdResources.push({ type: "inventory_detail", id: detail._id });
  });

  let createdAttributes = [];
  if (allAttributes.length > 0) {
    allAttributes.forEach((attr) => {
      attr.inventory_details_id =
        createdDetails[attr.inventory_detail_index]._id;
      delete attr.inventory_detail_index;
    });
    // console.log(
    //   `Batch creating ${allAttributes.length} attributes for inventory details...`
    // );

    createdAttributes =
      await productService.batchCreateInventoryDetailsAttributes(allAttributes);
    createdAttributes.forEach((attr) => {
      createdResources.push({ type: "attribute", id: attr._id });
    });
  }

  // console.log(
  //   `Batch created ${inventoryDetails.length} inventory details and ${allAttributes.length} attributes`
  // );
  return { inventoryDetails: createdDetails, attributes: createdAttributes };
}

async function updateProductCaches(product, productName) {
  const pipeline = redis.pipeline();

  pipeline.setex(`product:${product._id}`, 3600, JSON.stringify(product));
  pipeline.setex(
    `product:name:${productName.toLowerCase()}`,
    3600,
    JSON.stringify(product)
  );
  pipeline.del("allProducts");
  pipeline.del("products:list:*");
  pipeline.del("products:category:*");
  pipeline.incr("products:count");

  await pipeline.exec();
  // console.log("Redis caches updated");
}

async function cleanupCreatedResources(createdResources) {
  // console.log("Starting cleanup of created resources...");

  for (const resource of createdResources.reverse()) {
    try {
      switch (resource.type) {
        case "attribute":
          await productService.deleteInventoryDetailsAttribute(resource.id);
          break;
        case "inventory_detail":
          await productService.deleteInventoryDetails(resource.id);
          break;
        case "inventory":
          await productService.deleteInventory(resource.id);
          break;
        case "product":
          await productService.deleteProduct(resource.id);
          break;
      }
      // console.log(`Cleaned up ${resource.type}: ${resource.id}`);
    } catch (cleanupError) {
      // console.error(
      //   `Failed to cleanup ${resource.type} ${resource.id}:`,
      //   cleanupError.message
      // );
    }
  }
}

export async function updateProduct(id, formData) {
  const startTime = Date.now();
  const updatedResources = [];

  try {
    // Step 1: Parse form data
    const { productData, inventoryData, itemVariants } =
      await parseUpdateFormData(formData);
    // console.log("Parsed form data:", {
    //   productData,
    //   inventoryData: {
    //     ...inventoryData,
    //     stock_status: inventoryData.stock_status,
    //     manage_stock: inventoryData.manage_stock,
    //   },
    //   inventoryData,
    //   itemVariants,
    // });
    // console.log("Inventory data stock_status:", inventoryData.stock_status);
    // console.log("Inventory data manage_stock:", inventoryData.manage_stock);

    // Step 2: Validate product data
    const { error, value } = productUpdateValidator.validate(productData);
    if (error) {
      return {
        status: 400,
        body: errorResponse("Validation error", 400, error.details),
      };
    }

    // Step 3: Fetch existing product
    const existingProduct = await productService.getProductById(id);
    if (!existingProduct) {
      return {
        status: 404,
        body: errorResponse("Product not found", 404),
      };
    }

    // Step 4: Process file uploads
    const fileUploadPromises = [];
    let mainImageUrls = [];

    // Handle main images
    const mainImages = [];
    const imagesFromGetAll = formData.getAll("image");
    if (imagesFromGetAll && imagesFromGetAll.length > 0) {
      imagesFromGetAll.forEach((img) => {
        if (img && img instanceof File) mainImages.push(img);
      });
    }

    let idx = 0;
    while (true) {
      const indexedImage = formData.get(`images[${idx}]`);
      if (!indexedImage) break;
      if (indexedImage instanceof File) mainImages.push(indexedImage);
      idx++;
    }

    const uniqueMainImages = Array.from(new Set(mainImages));
    uniqueMainImages.forEach((mainImage, idx) => {
      if (mainImage && mainImage instanceof File) {
        fileUploadPromises.push(
          processImageUpload(mainImage, "products", `main_${id}_${idx}`).then(
            (url) => {
              mainImageUrls.push(url);
            }
          )
        );
      }
    });

    const itemImagePromises = itemVariants.map((variant, index) => {
      if (variant.image && variant.image instanceof File) {
        return processImageUpload(
          variant.image,
          "products",
          `item_${id}_${index}`
        ).then((url) => {
          variant.processedImageUrl = url;
          return url;
        });
      }
      return Promise.resolve(null);
    });

    fileUploadPromises.push(...itemImagePromises);
    await Promise.all(fileUploadPromises);

    // Parse existing images that were kept by the user
    const existingImagesList = [];
    const existingImagesFromForm = formData.getAll("existingImages");
    if (existingImagesFromForm.length === 1 && existingImagesFromForm[0] === '[]') {
      // all existing images were deleted by user
    } else if (existingImagesFromForm.length > 0) {
      existingImagesFromForm.forEach(img => existingImagesList.push(img));
    }

    // Merge new images with retained existing ones
    value.image = [...existingImagesList, ...mainImageUrls];

    // Step 5: Update product
    const updatedProduct = await productService.updateProduct(id, value, {
      itemVariants,
    });
    updatedResources.push({ type: "product", id: updatedProduct._id });
    // console.log("Product updated:", updatedProduct._id);

    // Step 6: Update or create inventory
    let inventoryRecord = null;
    if (
      inventoryData.sku !== undefined ||
      inventoryData.stock_count !== undefined ||
      inventoryData.stock_status !== undefined ||
      inventoryData.manage_stock !== undefined ||
      inventoryData.lowStockThreshold !== undefined
    ) {
      // Check for existing inventory
      inventoryRecord = await ProductInventory.findOne({ product: id });
      if (inventoryRecord) {
        // Update existing inventory
        const updatedInventory = await productService.updateInventory(id, inventoryData);
        // Convert to plain object for response
        inventoryRecord = updatedInventory.toObject ? updatedInventory.toObject() : updatedInventory;
        updatedResources.push({ type: "inventory", id: inventoryRecord._id });
      } else {
        // Create new inventory if none exists
        const newInventoryData = {
          product: id,
          sku: inventoryData.sku || `SKU-${id}-${Date.now()}`,
          stock_count: inventoryData.stock_count || 0,
          sold_count: 0,
          stock_status: inventoryData.stock_status || 'in_stock',
          manage_stock: inventoryData.manage_stock || 'yes',
          lowStockThreshold: inventoryData.lowStockThreshold || 5,
        };
        const createdInventory = await productService.createInventory(newInventoryData);
        // Convert to plain object for response
        inventoryRecord = createdInventory.toObject ? createdInventory.toObject() : createdInventory;
        updatedResources.push({ type: "inventory", id: inventoryRecord._id });
      }
    } else {
      const existingInventory = await ProductInventory.findOne({ product: id });
      inventoryRecord = existingInventory ? (existingInventory.toObject ? existingInventory.toObject() : existingInventory) : null;
    }

    // Log the final inventory record before response
    // console.log("Final inventory record stock_status:", inventoryRecord?.stock_status);
    // console.log("Final inventory record manage_stock:", inventoryRecord?.manage_stock);
    // console.log("Final inventory record full object:", JSON.stringify(inventoryRecord, null, 2));

    // Step 7: Update or create inventory details & attributes
    let inventoryDetails = [];
    let inventoryDetailAttributes = [];
    let shapeTermsMap = new Map(); // Declare outside to use in response mapping

    if (itemVariants.length > 0) {
      const detailsResult = await updateInventoryDetailsInBatch(
        id,
        inventoryRecord?._id,
        itemVariants,
        updatedResources
      );
      inventoryDetails = detailsResult.inventoryDetails;
      inventoryDetailAttributes = detailsResult.attributes;
    } else {
      // If no variants were updated, fetch existing inventory details
      if (inventoryRecord?._id) {
        inventoryDetails = await ProductInventoryDetails.find({
          product_id: id,
          product_inventory_id: inventoryRecord._id,
        }).lean();
      }
    }

    // Fetch all attributes for all inventory details to ensure we have complete data
    if (inventoryDetails.length > 0) {
      const detailIds = inventoryDetails.map(d => d._id).filter(Boolean);
      if (detailIds.length > 0) {
        const allAttrs = await ProductInventoryDetailAttribute.find({
          inventory_details_id: { $in: detailIds },
          deletedAt: null,
        }).lean();
        // Replace with fetched attributes to ensure we have the latest data
        inventoryDetailAttributes = allAttrs;
      }
    }

    // [RESOLUTION FIX] Fetch attribute definitions to resolve IDs to names/images
    const attrDefs = await (await import("../models/productAttribute.js")).default.find({ deletedAt: null }).lean();
    const termValueMap = new Map();
    const termImageMap = new Map();

    attrDefs.forEach(def => {
      const titleKey = def.title.toLowerCase();
      if (def.terms && Array.isArray(def.terms)) {
        def.terms.forEach(term => {
          if (term.value) {
            const valueKey = `${titleKey}:${term.value.toLowerCase()}`;
            if (term.image) termImageMap.set(valueKey, term.image);
          }
          if (term._id) {
            const idKey = `${titleKey}:${term._id.toString()}`;
            if (term.value) termValueMap.set(idKey, term.value);
            if (term.image) termImageMap.set(idKey, term.image);
          }
        });
      }
    });

    // Map inventoryDetailAttributes to resolve their values and images
    inventoryDetailAttributes = inventoryDetailAttributes.map(attr => {
      const name = (attr.attribute_name || attr.name || "").toLowerCase();
      const val = (attr.attribute_value || attr.value || "").toLowerCase();
      const key = `${name}:${val}`;
      return {
        ...attr,
        attribute_value: termValueMap.get(key) || attr.attribute_value || attr.value,
        image: termImageMap.get(key) || null
      };
    });

    // Fetch shape attribute terms once for all variants (optimization)
    try {
      const ProductAttribute = (await import("../models/productAttribute.js")).default;
      const shapeAttribute = await ProductAttribute.findOne({
        title: { $regex: /shape/i },
        deletedAt: null
      }).lean();

      if (shapeAttribute?.terms && Array.isArray(shapeAttribute.terms)) {
        shapeAttribute.terms.forEach(term => {
          const termId = term._id?.toString() || term.id?.toString();
          const termValue = term.value || term.name;
          if (termId) {
            shapeTermsMap.set(termId, term);
          }
          if (termValue) {
            shapeTermsMap.set(termValue, term);
          }
        });
      }
    } catch (error) {
      // console.error("Error fetching shape terms:", error);
    }

    // Step 8: Update Redis cache
    await updateProductCaches(
      updatedProduct,
      value.name || existingProduct.name
    );

    const executionTime = Date.now() - startTime;
    // console.log(`Product update completed in ${executionTime}ms`);

    // Step 9: Construct response data
    // Added is_diamond to response data
    const responseData = {
      name: updatedProduct.name,
      slug: updatedProduct.slug,
      summary: updatedProduct.summary,
      category_id: updatedProduct.category_id,
      subCategory_id: updatedProduct.subCategory_id,
      description: updatedProduct.description,
      image: updatedProduct.image,
      price: updatedProduct.price,
      saleprice: updatedProduct.saleprice,
      cost: updatedProduct.cost,
      badge_id: updatedProduct.badge_id,
      brand_id: updatedProduct.brand_id,
      status: updatedProduct.status || "active",
      product_type: updatedProduct.product_type,
      sold_count: updatedProduct.sold_count || 0,
      min_purchase: updatedProduct.min_purchase,
      max_purchase: updatedProduct.max_purchase,
      is_refundable: updatedProduct.is_refundable,
      is_in_house: updatedProduct.is_in_house,
      is_inventory_warn_able: updatedProduct.is_inventory_warn_able,
      admin_id: updatedProduct.admin_id,
      vendor_id: updatedProduct.vendor_id,
      isTaxable: updatedProduct.isTaxable,
      taxClass: updatedProduct.taxClass,
      is_diamond: updatedProduct.is_diamond,
      deleted_at: updatedProduct.deleted_at,
      _id: updatedProduct._id,
      created_at: updatedProduct.created_at,
      updated_at: updatedProduct.updated_at,
      __v: updatedProduct.__v,
      inventory: inventoryRecord
        ? {
          _id: inventoryRecord._id,
          product: inventoryRecord.product,
          sku: inventoryRecord.sku,
          stock_count: inventoryRecord.stock_count,
          sold_count: inventoryRecord.sold_count,
          stock_status: inventoryRecord.stock_status !== undefined ? inventoryRecord.stock_status : 'in_stock',
          manage_stock: inventoryRecord.manage_stock !== undefined ? inventoryRecord.manage_stock : 'yes',
          lowStockThreshold: inventoryRecord.lowStockThreshold !== undefined ? inventoryRecord.lowStockThreshold : 5,
          created_at: inventoryRecord.created_at,
          updated_at: inventoryRecord.updated_at,
          __v: inventoryRecord.__v,
          inventory_details: await Promise.all(inventoryDetails.map(async (detail) => {
            const detailAttributes = inventoryDetailAttributes
              .filter(
                (attr) =>
                  (attr.inventory_details_id?.toString() || attr.inventory_details_id?._id?.toString() || "") ===
                  detail._id.toString()
              )
              .map((attr) => ({
                _id: attr._id,
                inventory_details_id: attr.inventory_details_id?._id || attr.inventory_details_id,
                product_id: attr.product_id?._id || attr.product_id,
                name: attr.attribute_name || attr.name,
                value: attr.attribute_value || attr.value,
                created_at: attr.created_at,
                updated_at: attr.updated_at,
                __v: attr.__v,
              }));

            // Extract shape, carat, and metal type from attributes
            const shapeAttr = detailAttributes.find(attr =>
              (attr.name || "").toLowerCase() === "shape"
            );
            const caratAttr = detailAttributes.find(attr =>
              (attr.name || "").toLowerCase() === "carat"
            );
            const metalAttr = detailAttributes.find(attr => {
              const name = (attr.name || "").toLowerCase();
              return name.includes("metal") ||
                name === "metal type" ||
                name === "metaltype" ||
                name === "metatype";
            });

            // Metal type is stored in the color field (which is actually metal type ID)
            // Use metal attribute value if found, otherwise use color field
            const metalType = metalAttr?.value || detail.color || null;

            // Get shape image from pre-fetched shape terms map
            let shapeImage = null;
            if (shapeAttr?.value && shapeTermsMap.size > 0) {
              const shapeTerm = shapeTermsMap.get(shapeAttr.value);
              if (shapeTerm) {
                shapeImage = shapeTerm.image ||
                  shapeTerm.icon ||
                  shapeTerm.imageUrl ||
                  shapeTerm.iconUrl ||
                  shapeTerm.termImage ||
                  shapeTerm.term_image ||
                  shapeTerm.img ||
                  shapeTerm.icon_url ||
                  null;
              }
            }

            return {
              _id: detail._id,
              product_id: detail.product_id,
              product_inventory_id: detail.product_inventory_id,
              size: detail.size,
              color: detail.color,
              shape: shapeAttr?.value || null,
              shape_image: shapeImage,
              carat: caratAttr?.value || null,
              metal_type: metalType,
              additional_price: detail.additional_price,
              extra_cost: detail.add_cost || detail.extra_cost || 0,
              stock_count: detail.stock_count,
              image: detail.image,
              created_at: detail.created_at,
              updated_at: detail.updated_at,
              __v: detail.__v,
              attributes: detailAttributes,
            };
          })),
        }
        : null,
      execution_time: executionTime,
    };

    // Handle properties (like Metal Type) - these are product-level attributes
    const propertyData = formData.get("properties");
    let productProperties = {};
    if (propertyData) {
      try {
        const actualData = JSON.parse(propertyData);
        productProperties = actualData;

        // If there are inventory details, save properties as attributes on the first inventory detail
        if (inventoryDetails.length > 0) {
          // [FIX] Define attributes that are handled by the variants section to avoid overwriting them here
          const variantSpecificAttributes = ["shape", "carat", "color", "size", "metal type", "metaltype"];

          const propertyKeys = Object.keys(actualData).filter(key =>
            !variantSpecificAttributes.includes(key.toLowerCase())
          );

          if (propertyKeys.length > 0) {
            // Delete existing property attributes ONLY for the first inventory detail to avoid duplicates
            await ProductInventoryDetailAttribute.deleteMany({
              inventory_details_id: inventoryDetails[0]._id,
              attribute_name: { $in: propertyKeys },
              deletedAt: null,
            });

            const createAttributePromises = propertyKeys.map((key) => {
              return ProductInventoryDetailAttribute.create({
                inventory_details_id: inventoryDetails[0]._id,
                product_id: updatedProduct._id,
                attribute_name: key,
                attribute_value: actualData[key],
              });
            });

            const createdPropertyAttributes = await Promise.all(createAttributePromises);

            // Add to inventoryDetailAttributes for response
            inventoryDetailAttributes = [...inventoryDetailAttributes, ...createdPropertyAttributes];
          }
        }
      } catch (e) {
        // console.error("Error parsing properties:", e);
      }
    }


    // Fetch all product attributes to include in response
    const allProductAttributes = await ProductInventoryDetailAttribute.find({
      product_id: updatedProduct._id,
      deletedAt: null,
    }).lean();

    // Group attributes by name for easier access
    const groupedAttributes = {};
    allProductAttributes.forEach(attr => {
      if (!groupedAttributes[attr.attribute_name]) {
        groupedAttributes[attr.attribute_name] = [];
      }
      groupedAttributes[attr.attribute_name].push({
        _id: attr._id,
        attribute_name: attr.attribute_name,
        attribute_value: attr.attribute_value,
        inventory_details_id: attr.inventory_details_id,
      });
    });

    // Add properties to response data - accessible at root level
    responseData.properties = productProperties;
    // Also include all attributes grouped by name
    responseData.attributes = groupedAttributes;

    return {
      status: 200,
      body: successResponse(responseData, "Product updated successfully"),
    };
  } catch (err) {
    // console.error("Update Product error:", err.message, err.stack);
    if (updatedResources.length > 0) {
      await cleanupCreatedResources(updatedResources);
    }
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

async function parseUpdateFormData(data) {
  // console.log("Parsing update form data...");
  // console.log("Received form data:", data);

  // Helper to get the correct value for each variant index
  function getVariantValue(field, idx) {
    let val = data.getAll(field);
    if (Array.isArray(val) && val.length > 0) {
      // If value is an array of arrays (e.g., [[{}, {}], [{}, {}]]) for images, return the correct subarray
      if (Array.isArray(val[0]) && typeof val[0] !== "string") {
        return val[idx];
      }
      // If value is a single string with commas, split it
      if (typeof val[0] === "string" && val[0].includes(",")) {
        const arr = val[0].split(",");
        return arr[idx] !== undefined ? arr[idx] : undefined;
      }
      // Otherwise, return the value at idx if it exists
      return val[idx] !== undefined ? val[idx] : undefined;
    }
    // If empty array or not array, return undefined
    return undefined;
  }

  const productData = {
    name: data.get("name") || undefined,
    category_id: data.get("category_id") || undefined,
    subCategory_id: data.get("subCategory_id") || undefined,
    slug:
      data.get("slug") ||
      (data.get("name")
        ? data.get("name").toLowerCase().replace(/\s+/g, "-")
        : undefined),
    summary: data.get("summary") || undefined,
    description: data.get("description") || undefined,
    price: data.get("price") ? parseFloat(data.get("price")) : undefined,
    saleprice: data.get("saleprice")
      ? parseFloat(data.get("saleprice"))
      : undefined,
    cost: data.get("cost") ? parseFloat(data.get("cost")) : undefined,
    badge_id: data.get("badge_id") ? parseInt(data.get("badge_id")) : undefined,
    brand_id: data.get("brand") || undefined,
    min_purchase: data.get("min_purchase")
      ? parseInt(data.get("min_purchase"))
      : undefined,
    max_purchase: data.get("max_purchase")
      ? parseInt(data.get("max_purchase"))
      : undefined,
    is_inventory_warn_able: data.get("is_inventory_warn_able")
      ? data.get("is_inventory_warn_able") === "true"
      : undefined,
    is_refundable: data.get("is_refundable")
      ? data.get("is_refundable") === "true"
      : undefined,
    isTaxable: data.get("isTaxable")
      ? data.get("isTaxable") === "true"
      : undefined,
    taxClass:
      data.get("isTaxable") && data.get("taxClass")
        ? data.get("taxClass")
        : undefined,
    // Added is_diamond parsing
    is_diamond: data.get("is_diamond")
      ? data.get("is_diamond") === "true"
      : undefined,
  };

  // Helper function to normalize stock_status values
  const normalizeStockStatus = (value) => {
    if (!value) {
      // console.log("normalizeStockStatus: value is falsy, returning undefined");
      return undefined;
    }
    // Convert to string, lowercase, and remove extra whitespace
    const normalized = String(value).toLowerCase().trim().replace(/\s+/g, ' ');
    // console.log(`normalizeStockStatus: input="${value}", normalized="${normalized}"`);

    // Handle various formats: "Out of Stock" -> "out_of_stock", "in stock" -> "in_stock"
    // Check for "out of stock" pattern (must contain both "out" and "stock", and "out" should come before "stock")
    const hasOut = normalized.includes("out");
    const hasStock = normalized.includes("stock");
    const hasIn = normalized.includes("in");

    if (hasOut && hasStock && !hasIn) {
      // "out of stock", "out-of-stock", "outofstock", etc.
      // console.log("normalizeStockStatus: matched 'out' + 'stock' (without 'in'), returning 'out_of_stock'");
      return "out_of_stock";
    }
    if (hasIn && hasStock && !hasOut) {
      // "in stock", "in-stock", "instock", etc.
      // console.log("normalizeStockStatus: matched 'in' + 'stock' (without 'out'), returning 'in_stock'");
      return "in_stock";
    }
    // If already in correct format, return as is
    if (normalized === "out_of_stock" || normalized === "in_stock") {
      // console.log(`normalizeStockStatus: already in correct format, returning "${normalized}"`);
      return normalized;
    }
    // console.log("normalizeStockStatus: no match found, returning undefined");
    return undefined;
  };

  // Helper function to normalize manage_stock values
  const normalizeManageStock = (value) => {
    if (!value) return undefined;
    const normalized = String(value).toLowerCase().trim();
    if (normalized === "yes" || normalized === "no" || normalized === "true" || normalized === "false") {
      return normalized === "yes" || normalized === "true" ? "yes" : "no";
    }
    return undefined;
  };

  // Debug: Check what FormData contains
  const stockStatusRaw = data.get("stockStatus") || data.get("stock_status");
  // console.log("FormData stockStatus check:", {
  //   "stockStatus": data.get("stockStatus"),
  //   "stock_status": data.get("stock_status"),
  //   "raw value": stockStatusRaw,
  // });

  const inventoryData = {
    sku: data.get("sku") || undefined,
    stock_count: data.get("stockQuantity")
      ? parseInt(data.get("stockQuantity"))
      : data.get("quantity")
        ? parseInt(data.get("quantity"))
        : undefined,
    // Check both camelCase and snake_case, and normalize the value
    stock_status: normalizeStockStatus(stockStatusRaw),
    manage_stock: normalizeManageStock(
      data.get("manageStock") || data.get("manage_stock")
    ),
    lowStockThreshold: data.get("lowStockThreshold")
      ? parseInt(data.get("lowStockThreshold"))
      : undefined,
  };

  // console.log("Final inventoryData after parsing:", {
  //   stock_status: inventoryData.stock_status,
  //   manage_stock: inventoryData.manage_stock,
  //   stock_count: inventoryData.stock_count,
  // });

  // console.log("Final inventoryData after parsing:", {
  //   stock_status: inventoryData.stock_status,
  //   manage_stock: inventoryData.manage_stock,
  //   stock_count: inventoryData.stock_count,
  // });

  const itemVariants = [];

  // Helper function to get values from form data with bracket notation (e.g., item_size[0], item_size[1])
  const getBracketNotationValues = (baseName) => {
    const values = [];
    let index = 0;
    let consecutiveMissing = 0;
    const maxGap = 3;

    while (consecutiveMissing < maxGap) {
      const value = data.get(`${baseName}[${index}]`);
      if (value === null || value === undefined) {
        consecutiveMissing++;
        values.push(undefined);
      } else {
        values.push(value);
        consecutiveMissing = 0;
      }
      index++;
    }
    while (values.length > 0 && values[values.length - 1] === undefined) {
      values.pop();
    }
    return values;
  };

  // Get all variant field arrays using bracket notation (consistent with create)
  const itemSizes = getBracketNotationValues("item_size");
  const itemColors = getBracketNotationValues("item_color");
  const itemShapes = getBracketNotationValues("item_shape");
  const itemCarats = getBracketNotationValues("item_carat");
  // Read additional_price and extra_cost separately (they are different fields)
  const itemAdditionalPrices = getBracketNotationValues("item_additional_price");
  const itemExtraCosts = getBracketNotationValues("item_extra_cost");
  const itemStockCounts = getBracketNotationValues("item_stock_count").length > 0
    ? getBracketNotationValues("item_stock_count")
    : getBracketNotationValues("item_stock");
  const inventoryDetailsIds = getBracketNotationValues("inventoryDetailsId");
  const itemImages = getBracketNotationValues("item_image");

  // console.log("Parsed update variant fields:", {
  //   itemSizes: itemSizes.length,
  //   itemColors: itemColors.length,
  //   itemShapes: itemShapes.length,
  //   itemCarats: itemCarats.length,
  //   itemAdditionalPrices: itemAdditionalPrices.length,
  //   itemExtraCosts: itemExtraCosts.length,
  //   itemStockCounts: itemStockCounts.length,
  //   itemImages: itemImages.length,
  //   inventoryDetailsIds: inventoryDetailsIds.length
  // });

  // Calculate max length across all variant fields
  const maxLength = Math.max(
    itemSizes.length,
    itemColors.length,
    itemShapes.length,
    itemCarats.length,
    itemAdditionalPrices.length,
    itemExtraCosts.length,
    itemStockCounts.length,
    itemImages.length,
    inventoryDetailsIds.length
  );

  // console.log("Max length for update variants:", maxLength);

  for (let i = 0; i < maxLength; i++) {
    const size = itemSizes[i];
    const color = itemColors[i];
    const shape = itemShapes[i];
    const carat = itemCarats[i];
    const inventoryDetailsId = inventoryDetailsIds[i];

    // Skip if no variant fields are present and no ID (should keep existing if ID?)
    // Actually, if we have an ID but no other fields, it might be a partial update.
    // However, the current logic seems to rebuild the variant list.
    // console.log(`[DEBUG] Parsing update variant ${i}: size=${size}, color=${color}, shape=${shape}, carat=${carat}, id=${inventoryDetailsId}`);

    const additionalPrice = itemAdditionalPrices[i];
    const extra_cost = itemExtraCosts[i];
    const stock_count = itemStockCounts[i];
    const image = itemImages[i];

    if (!size && !color && !shape && !carat && !inventoryDetailsId && !additionalPrice && !extra_cost && !stock_count && !image) {
      // console.log(`[DEBUG] Skipping empty variant at index ${i}`);
      continue;
    }


    // Read variant SKU from form data
    const sku = data.get(`item_sku[${i}]`) || "";

    const variant = {
      inventoryDetailsId: inventoryDetailsId || undefined,
      size: size || undefined,
      color: color || undefined,
      sku: sku || "",
      additional_price: additionalPrice !== undefined && !isNaN(parseFloat(additionalPrice)) ? parseFloat(additionalPrice) : 0,
      extra_cost: extra_cost !== undefined && !isNaN(parseFloat(extra_cost)) ? parseFloat(extra_cost) : 0,
      stock_count: stock_count !== undefined && !isNaN(parseInt(stock_count)) ? parseInt(stock_count) : 0,
      image: image || undefined,
      attributes: [],
    };


    // Add Shape attribute if present
    if (shape && typeof shape === 'string' && shape.trim() !== '') {
      variant.attributes.push({
        name: "Shape",
        value: shape.trim(),
      });
    }

    // Add Carat attribute if present
    if (carat && typeof carat === 'string' && carat.trim() !== '') {
      variant.attributes.push({
        name: "Carat",
        value: carat.trim(),
      });
    }

    // For attributes, if they exist as arrays using bracket notation
    let attrIndex = 0;
    while (data.get(`item_attribute_name[${i}][${attrIndex}]`) !== null) {
      variant.attributes.push({
        name: data.get(`item_attribute_name[${i}][${attrIndex}]`),
        value: data.get(`item_attribute_value[${i}][${attrIndex}]`),
      });
      attrIndex++;
    }

    itemVariants.push(variant);
  }

  // console.log(`[DEBUG] parseUpdateFormData completed. Returning ${itemVariants.length} variants.`);
  return { productData, inventoryData, itemVariants };
}

async function updateInventoryDetailsInBatch(
  productId,
  inventoryId,
  itemVariants,
  updatedResources
) {
  const inventoryDetails = [];
  const allAttributes = [];

  // Get all existing inventory details for this product
  const existingDetails = await ProductInventoryDetails.find({
    product_id: productId,
    product_inventory_id: inventoryId,
  });

  // Extract IDs of variants that are being updated/kept
  const keptVariantIds = itemVariants
    .map(v => v.inventoryDetailsId)
    .filter(id => id); // Filter out undefined/null (new variants)

  // Find variants that should be deleted (exist in DB but not in update request)
  const variantsToDelete = existingDetails.filter(
    detail => !keptVariantIds.includes(detail._id.toString())
  );

  // Delete variants that are not in the update request
  if (variantsToDelete.length > 0) {
    // console.log(`[DEBUG] Deleting ${variantsToDelete.length} inventory details that were removed. Kept IDs:`, keptVariantIds);
    for (const detailToDelete of variantsToDelete) {
      // console.log(`[DEBUG] Deleting variant ID: ${detailToDelete._id}`);
      // Delete associated attributes first
      await ProductInventoryDetailAttribute.deleteMany({
        inventory_details_id: detailToDelete._id,
      });
      // Then delete the inventory detail
      await productService.deleteInventoryDetails(detailToDelete._id);
    }
  }

  // console.log(`[DEBUG] Processing ${itemVariants.length} variants in batch update...`);

  // Process variants that are being updated or created
  for (let i = 0; i < itemVariants.length; i++) {
    const variant = itemVariants[i];
    // console.log(`[DEBUG] Processing variant ${i}:`, JSON.stringify(variant));
    const { inventoryDetailsId, image, attributes, ...variantData } = variant;

    // image is either a File object (new) or a string/array (existing)
    let imageUrls = [];
    if (image && image instanceof File) {
      const url = await processImageUpload(
        image,
        "products",
        `item_${productId}_${inventoryDetailsId || Date.now()}`
      );
      imageUrls = [url];
    } else if (typeof image === 'string') {
      imageUrls = [image];
    } else if (Array.isArray(image)) {
      imageUrls = image;
    }

    // Ensure stock_count is a valid number, default to 0 if not
    let stock_count = 0;
    if (
      typeof variantData.stock_count === "number" &&
      !isNaN(variantData.stock_count)
    ) {
      stock_count = variantData.stock_count;
    } else if (
      typeof variantData.stock_count === "string" &&
      !isNaN(parseInt(variantData.stock_count))
    ) {
      stock_count = parseInt(variantData.stock_count);
    }

    // extra_cost is stored in the 'add_cost' field in the schema
    let extra_cost = 0;
    if (typeof variantData.extra_cost === "number" && !isNaN(variantData.extra_cost)) {
      extra_cost = variantData.extra_cost;
    } else if (typeof variantData.extra_cost === "string" && !isNaN(parseFloat(variantData.extra_cost))) {
      extra_cost = parseFloat(variantData.extra_cost);
    }

    const detailData = {
      product_id: productId,
      product_inventory_id: inventoryId,
      size: variantData.size || null, // Sanitize empty strings
      color: variantData.color || null,
      additional_price: variantData.additional_price || 0,
      add_cost: extra_cost, // Store extra_cost in the 'add_cost' schema field
      stock_count, // always a valid number
      sku: variantData.sku || "",
      image: imageUrls,
    };

    // console.log(`[DEBUG] Variant ${i} detailData:`, JSON.stringify(detailData));

    let createdDetail;
    try {
      if (inventoryDetailsId) {
        // console.log(`[DEBUG] Updating existing variant: ${inventoryDetailsId}`);
        createdDetail = await productService.updateInventoryDetails(
          inventoryDetailsId,
          detailData
        );
      } else {
        // console.log(`[DEBUG] Creating new variant for product: ${productId}`);
        createdDetail = await productService.createInventoryDetails(detailData);
      }
    } catch (opError) {
      // console.error(`[ERROR] Failed to ${inventoryDetailsId ? 'update' : 'create'} variant at index ${i}:`, opError);
      // console.log(`[DEBUG] Failed variant detailData:`, JSON.stringify(detailData));
      throw opError;
    }

    if (createdDetail) {
      // console.log(`[DEBUG] Variant ${i} ${inventoryDetailsId ? 'updated' : 'created'} successfully with ID: ${createdDetail._id}`);
      inventoryDetails.push(createdDetail);
      updatedResources.push({
        type: "inventory_detail",
        id: createdDetail._id,
      });

      if (attributes && attributes.length > 0) {
        // [FIX] Delete existing attributes for this specific variant to ensure clean update
        // This prevents duplicates and ensures the latest values are what the GET request finds first
        if (inventoryDetailsId) {
          // console.log(`[DEBUG] Clearing old attributes for variant ${inventoryDetailsId} before update`);
          await ProductInventoryDetailAttribute.deleteMany({
            inventory_details_id: inventoryDetailsId,
            deletedAt: null
          });
        }

        const detailAttributes = attributes.map((attr) => ({
          attribute_name: (attr.name || attr.attribute_name || "").trim(),
          attribute_value: (attr.value || attr.attribute_value || "").trim(),
          inventory_details_id: createdDetail._id,
          product_id: productId,
        }));
        // console.log(`[DEBUG] Adding ${detailAttributes.length} attributes to allAttributes for variant ${createdDetail._id}`);
        allAttributes.push(...detailAttributes);
      }

    }
  }

  let createdAttributes = [];
  if (allAttributes.length > 0) {
    // console.log(`[DEBUG] Total attributes to process: ${allAttributes.length}`);
    const variantIds = inventoryDetails.map((d) => d._id);
    const existingAttributes = await ProductInventoryDetailAttribute.find({
      inventory_details_id: { $in: variantIds },
    });
    // console.log(`[DEBUG] Found ${existingAttributes.length} existing attributes in DB for these variants`);

    // [FIX] Since we already deleted existing attributes for updated variants above,
    // we should just create all of them to avoid duplicate checks and logic issues.
    for (const attr of allAttributes) {
      // console.log(`[DEBUG] Creating attribute: "${attr.attribute_name}" with value: "${attr.attribute_value}" for variant: ${attr.inventory_details_id}`);
      const createdAttr = await productService.createInventoryDetailsAttributes(attr);
      if (createdAttr) {

        createdAttributes.push(createdAttr);
        updatedResources.push({ type: "attribute", id: createdAttr._id });
      }
    }
  }

  // console.log(
  //   `[DEBUG] updateInventoryDetailsInBatch completed. Updated/Created ${inventoryDetails.length} details and ${createdAttributes.length} attributes`
  // );
  return { inventoryDetails, attributes: createdAttributes };
}

export async function getProductsByAttribute(query) {
  try {
    const products = await productService.getProductsByAttribute(query);

    return {
      status: 200,
      body: successResponse(products, "Products fetched by attribute"),
    };
  } catch (err) {
    // console.error("Get Products by Attribute error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

export async function getProducts(query, user = null) {
  try {
    const result = await productService.getAllProducts(query, user);
    return {
      status: 200,
      body: { success: true, message: 'Products fetched successfully', data: result }
    };
  } catch (err) {
    // console.error('Get Products error:', err.message, err.stack);
    return {
      status: 500,
      body: {
        success: false,
        message: err.message || 'Server error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
    };
  }
}

export async function getProductById(id, slug) {
  try {
    // id is the category slug, slug is the product slug
    const product = await productService.getProductByIdAndSlug(
      id,
      slug
    );
    if (!product) {
      return {
        status: 404,
        body: errorResponse("Product not found", 404),
      };
    }
    return {
      status: 200,
      body: successResponse(product, "Product fetched"),
    };
  } catch (err) {
    // console.error("Get Product by ID error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

export async function deleteProduct(id) {
  // console.log(`Delete Product called with ID: ${id}`);
  try {
    const deletedProduct = await productService.deleteProduct(id);
    if (!deletedProduct) {
      return {
        status: 404,
        body: errorResponse("Product not found", 404),
      };
    }

    await redis.del("allProducts");

    return {
      status: 200,
      body: successResponse(deletedProduct, "Product deleted"),
    };
  } catch (err) {
    // console.error("Delete Product error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}
