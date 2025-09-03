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
import Product from "../models/Product.js";

const productService = new ProductService();
const redis = initRedis();

export async function createProduct(formData) {
  const startTime = Date.now();
  let product = null;
  const createdResources = [];

  try {
    const data = formData;

    console.log("Starting product creation...");
    console.log("Received form data:", data);

    // Step 1: Parse and validate all data upfront
    const { productData, inventoryData, itemVariants } = await parseFormData(
      data
    );

     if (formData.get("is_diamond")) {
      productData.is_diamond = formData.get("is_diamond") === "true";
    }
    console.log("Parsed product data, including is_diamond:", productData);
    console.log("Received form data:", itemVariants);
   

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
    console.log("Processing file uploads...");

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

    console.log("All images processed successfully:", value);

    // Step 5: Create product

    console.log("Product data to be stored, including is_diamond:", value);
    product = await productService.createProduct(value);
    createdResources.push({ type: "product", id: product._id });
    console.log("Product created:", product._id);

    // Step 6: Create inventory record
    const inventory = {
      product: product._id,
      sku: inventoryData.sku,
      stock_count: inventoryData.stock_count,
      sold_count: 0,
    };

    const inventoryRecord = await productService.createInventory(inventory);
    createdResources.push({ type: "inventory", id: inventoryRecord._id });

    // Step 7: Batch create inventory details and attributes
    let inventoryDetails = [];
    let inventoryDetailAttributes = [];
    console.log("Creating inventory details in batch...");
    console.log("Item variants to process:", itemVariants.length);
    if (itemVariants.length > 0) {
      const detailsResult = await createInventoryDetailsInBatch(
        product._id,
        inventoryRecord._id,
        itemVariants,
        createdResources
      );
      inventoryDetails = detailsResult.inventoryDetails;
      inventoryDetailAttributes = detailsResult.attributes;
    }

    // Step 8: Update Redis cache
    await updateProductCaches(product, value.name);

    const executionTime = Date.now() - startTime;
    console.log(`Product creation completed in ${executionTime}ms`);

    console.log(
      "inventory Details : " + JSON.stringify(inventoryDetails, null, 2)
    );

    const propertyData = formData.get("properties");
    if (propertyData) {
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
        inventory_details: inventoryDetails.map((detail) => ({
          _id: detail._id,
          product_id: detail.product_id,
          product_inventory_id: detail.product_inventory_id,
          size: detail.size,
          color: detail.color,
          additional_price: detail.additional_price,
          extra_cost: detail.extra_cost,
          stock_count: detail.stock_count,
          image: detail.image,
          created_at: detail.created_at,
          updated_at: detail.updated_at,
          __v: detail.__v,
          attributes: inventoryDetailAttributes
            .filter(
              (attr) =>
                attr.inventory_details_id.toString() === detail._id.toString()
            )
            .map((attr) => ({
              _id: attr._id,
              inventory_details_id: attr.inventory_details_id,
              product_id: attr.product_id,
              name: attr.name,
              value: attr.value,
              created_at: attr.created_at,
              updated_at: attr.updated_at,
              __v: attr.__v,
            })),
        })),
      },
      execution_time: executionTime,
    };

    return {
      status: 201,
      body: successResponse(
        {
          ...product.toObject?.(), // Clean Mongoose document
          execution_time: executionTime,
        },
        "Product created successfully"
      ),
    };
  } catch (err) {
    console.error("Create Product error:", err.message);
    console.log("Error stack trace:", err.stack);
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
    stock_count: parseInt(data.get("quantity")) || 0,
  };

  const itemVariants = [];
  let itemIndex = 0;

  while (data.get(`item_size[${itemIndex}]`) !== null) {
    const variant = {
      size: data.get(`item_size[${itemIndex}]`),
      color: data.get(`item_color[${itemIndex}]`),
      additional_price:
        parseFloat(data.get(`item_additional_price[${itemIndex}]`)) || 0,
      extra_cost: parseFloat(data.get(`item_extra_cost[${itemIndex}]`)) || 0,
      stock_count: parseInt(data.get(`item_stock_count[${itemIndex}]`)) || 0,
      image: data.get(`item_image[${itemIndex}]`),
      attributes: [],
    };

    let attrIndex = 1;

    while (
      data.get(`item_attribute_name[${itemIndex}][${attrIndex}]`) !== null
    ) {
      variant.attributes.push({
        name: data.get(`item_attribute_name[${itemIndex}][${attrIndex}]`),
        value: data.get(`item_attribute_value[${itemIndex}][${attrIndex}]`),
      });
      attrIndex++;
    }
    console.log(`Parsed attributes for item ${itemIndex}:`, variant.attributes);
    itemVariants.push(variant);
    itemIndex++;
  }

  console.log("Parsed product data:", itemVariants);

  return { productData, inventoryData, itemVariants };
}

async function processImageUpload(imageFile, folder, identifier) {
  try {
    validateImageFile(imageFile);
    console.log(`Processing ${identifier} image:`, imageFile.name);
    const imageUrl = await saveFile(imageFile, folder);
    console.log(`${identifier} image saved:`, imageUrl);
    return imageUrl;
  } catch (error) {
    console.error(`${identifier} image upload failed:`, error.message);
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
      extra_cost: variant.extra_cost,
      stock_count: variant.stock_count,
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
    console.log(
      `Batch creating ${allAttributes.length} attributes for inventory details...`
    );

    createdAttributes =
      await productService.batchCreateInventoryDetailsAttributes(allAttributes);
    createdAttributes.forEach((attr) => {
      createdResources.push({ type: "attribute", id: attr._id });
    });
  }

  console.log(
    `Batch created ${inventoryDetails.length} inventory details and ${allAttributes.length} attributes`
  );
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
  console.log("Redis caches updated");
}

async function cleanupCreatedResources(createdResources) {
  console.log("Starting cleanup of created resources...");

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
      console.log(`Cleaned up ${resource.type}: ${resource.id}`);
    } catch (cleanupError) {
      console.error(
        `Failed to cleanup ${resource.type} ${resource.id}:`,
        cleanupError.message
      );
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
    console.log("Parsed form data:", {
      productData,
      inventoryData,
      itemVariants,
    });

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

    // Merge new images with existing ones
    value.image = [...(existingProduct.image || []), ...mainImageUrls];

    // Step 5: Update product
    const updatedProduct = await productService.updateProduct(id, value, {
      itemVariants,
    });
    updatedResources.push({ type: "product", id: updatedProduct._id });
    console.log("Product updated:", updatedProduct._id);

    // Step 6: Update or create inventory
    let inventoryRecord = null;
    if (
      inventoryData.sku !== undefined ||
      inventoryData.stock_count !== undefined
    ) {
      // Check for existing inventory
      inventoryRecord = await ProductInventory.findOne({ product: id });
      if (inventoryRecord) {
        // Update existing inventory
        inventoryRecord = await productService.updateInventory(id, inventoryData);
        updatedResources.push({ type: "inventory", id: inventoryRecord._id });
      } else {
        // Create new inventory if none exists
        const newInventoryData = {
          product: id,
          sku: inventoryData.sku || `SKU-${id}-${Date.now()}`,
          stock_count: inventoryData.stock_count || 0,
          sold_count: 0,
        };
        inventoryRecord = await productService.createInventory(newInventoryData);
        updatedResources.push({ type: "inventory", id: inventoryRecord._id });
      }
    } else {
      inventoryRecord = await ProductInventory.findOne({ product: id });
    }

    // Step 7: Update or create inventory details & attributes
    let inventoryDetails = [];
    let inventoryDetailAttributes = [];
    if (itemVariants.length > 0) {
      const detailsResult = await updateInventoryDetailsInBatch(
        id,
        inventoryRecord?._id,
        itemVariants,
        updatedResources
      );
      inventoryDetails = detailsResult.inventoryDetails;
      inventoryDetailAttributes = detailsResult.attributes;
    }

    // Step 8: Update Redis cache
    await updateProductCaches(
      updatedProduct,
      value.name || existingProduct.name
    );

    const executionTime = Date.now() - startTime;
    console.log(`Product update completed in ${executionTime}ms`);

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
            created_at: inventoryRecord.created_at,
            updated_at: inventoryRecord.updated_at,
            __v: inventoryRecord.__v,
            inventory_details: inventoryDetails.map((detail) => ({
              _id: detail._id,
              product_id: detail.product_id,
              product_inventory_id: detail.product_inventory_id,
              size: detail.size,
              color: detail.color,
              additional_price: detail.additional_price,
              extra_cost: detail.extra_cost,
              stock_count: detail.stock_count,
              image: detail.image,
              created_at: detail.created_at,
              updated_at: detail.updated_at,
              __v: detail.__v,
              attributes: inventoryDetailAttributes
                .filter(
                  (attr) =>
                    attr.inventory_details_id.toString() ===
                    detail._id.toString()
                )
                .map((attr) => ({
                  _id: attr._id,
                  inventory_details_id: attr.inventory_details_id,
                  product_id: attr.product_id,
                  name: attr.name,
                  value: attr.value,
                  created_at: attr.created_at,
                  updated_at: attr.updated_at,
                  __v: attr.__v,
                })),
            })),
          }
        : null,
      execution_time: executionTime,
    };

    const propertyData = formData.get("properties");
    if (propertyData && inventoryDetails.length > 0) {
      const actualData = JSON.parse(propertyData);

      const createAttributePromises = Object.keys(actualData).map((key) => {
        return ProductInventoryDetailAttribute.create({
          inventory_details_id: inventoryDetails[0]._id,
          product_id: updatedProduct._id,
          attribute_name: key,
          attribute_value: actualData[key],
        });
      });

      await Promise.all(createAttributePromises);
    }

    return {
      status: 200,
      body: successResponse(responseData, "Product updated successfully"),
    };
  } catch (err) {
    console.error("Update Product error:", err.message, err.stack);
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
  console.log("Parsing update form data...");
  console.log("Received form data:", data);

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

  const inventoryData = {
    sku: data.get("sku") || undefined,
    stock_count: data.get("quantity")
      ? parseInt(data.get("quantity"))
      : undefined,
  };

  const itemVariants = [];
  let itemIndex = 0;

  while (
    data.get(`item_size[${itemIndex}]`) !== null ||
    data.get(`inventoryDetailsId[${itemIndex}]`) !== null
  ) {
    const variant = {
      inventoryDetailsId:
        data.get(`inventoryDetailsId[${itemIndex}]`) || undefined,
      size: data.get(`item_size[${itemIndex}]`) || undefined,
      color: data.get(`item_color[${itemIndex}]`) || undefined,
      additional_price:
        parseFloat(data.get(`item_additional_price[${itemIndex}]`)) ||
        undefined,
      extra_cost:
        parseFloat(data.get(`item_extra_cost[${itemIndex}]`)) || undefined,
      stock_count:
        parseInt(data.get(`item_stock_count[${itemIndex}]`)) || undefined,
      image: data.get(`item_image[${itemIndex}]`),
      attributes: [],
    };

    let attrIndex = 0;
    while (
      data.get(`item_attribute_name[${itemIndex}][${attrIndex}]`) !== null
    ) {
      variant.attributes.push({
        name: data.get(`item_attribute_name[${itemIndex}][${attrIndex}]`),
        value: data.get(`item_attribute_value[${itemIndex}][${attrIndex}]`),
      });
      attrIndex++;
    }

    itemVariants.push(variant);
    itemIndex++;
  }

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

  for (const variant of itemVariants) {
    const { inventoryDetailsId, image, attributes, ...variantData } = variant;
    let imageUrl = variantData.image?.[0] || "";
    if (image && image instanceof File) {
      imageUrl = await processImageUpload(
        image,
        "products",
        `item_${productId}_${inventoryDetailsId || Date.now()}`
      );
    }

    const detailData = {
      product_id: productId,
      product_inventory_id: inventoryId,
      size: variantData.size,
      color: variantData.color,
      additional_price: variantData.additional_price,
      extra_cost: variantData.extra_cost,
      stock_count: variantData.stock_count,
      image: imageUrl ? [imageUrl] : variantData.image || [],
    };

    let createdDetail;
    if (inventoryDetailsId) {
      createdDetail = await productService.updateInventoryDetails(
        inventoryDetailsId,
        detailData
      );
    } else {
      createdDetail = await productService.createInventoryDetails(detailData);
    }

    if (createdDetail) {
      inventoryDetails.push(createdDetail);
      updatedResources.push({
        type: "inventory_detail",
        id: createdDetail._id,
      });

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

  let createdAttributes = [];
  if (allAttributes.length > 0) {
    const existingAttributes = await ProductInventoryDetailAttribute.find({
      inventory_details_id: { $in: inventoryDetails.map((d) => d._id) },
    });

    for (const attr of allAttributes) {
      const existingAttr = existingAttributes.find(
        (e) =>
          e.name === attr.name &&
          e.inventory_details_id.equals(attr.inventory_details_id)
      );
      let createdAttr;
      if (existingAttr) {
        createdAttr = await productService.updateInventoryDetailsAttributes(
          existingAttr._id,
          attr
        );
      } else {
        createdAttr = await productService.createInventoryDetailsAttributes(
          attr
        );
      }
      createdAttributes.push(createdAttr);
      updatedResources.push({ type: "attribute", id: createdAttr._id });
    }
  }

  console.log(
    `Batch updated/created ${inventoryDetails.length} inventory details and ${allAttributes.length} attributes`
  );
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
    console.error("Get Products by Attribute error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

export async function getProducts(query) {
  try {
    const products = await productService.getAllProducts(query);

    return {
      status: 200,
      body: successResponse(products, "Products fetched"),
    };
  } catch (err) {
    console.error("Get Products error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

export async function getProductById(id, slug, categorySlug) {
  try {
    const product = await productService.getProductByIdAndSlug(
      categorySlug,
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
    console.error("Get Product by ID error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}

export async function deleteProduct(id) {
  console.log(`Delete Product called with ID: ${id}`);
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
    console.error("Delete Product error:", err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || "Server error"),
    };
  }
}
