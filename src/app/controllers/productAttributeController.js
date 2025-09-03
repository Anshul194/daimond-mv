import ProductAttributeService from "../services/productAttributeService.js";
import {
  productAttributeCreateValidator,
  productAttributeUpdateValidator,
} from "../validators/productAttributeValidator.js";
import { saveFile, validateImageFile } from "../lib/fileUpload.js";
import { successResponse, errorResponse } from "../utils/response.js";
import initRedis from "../config/redis.js";

const productAttributeService = new ProductAttributeService();
const redis = initRedis();

export async function createProductAttribute(form) {
  try {
    const title = form.get("title");
    const category_id = form.get("category_id"); // <-- 👈 Add this line

    const terms = [];

    // Parse terms from form data
    let i = 0;
    while (form.has(`terms[${i}][value]`)) {
      const value = form.get(`terms[${i}][value]`)?.trim() || "";
      // Optionally handle images if you expect them: terms[${i}][image]
      const image = form.get(`terms[${i}][image]`);
      if (image) {
        try {
          validateImageFile(image);
          const imageUrl = await saveFile(image, "attribute-images");
          terms.push({ value, image: imageUrl }); // full path with folder prefix
        } catch (fileError) {
          return {
            status: 400,
            body: errorResponse(
              `Error uploading image for term #${i}`,
              400,
              fileError.message
            ),
          };
        }
      } else {
        terms.push({ value, image: "" }); // No image provided
      }
      i++;
    }

    console.log(
      "Creating Product Attribute with title:",
      title,
      "and terms:",
      terms
    );

    // (existing code...)

    // Validate final data
    const { error, value } = productAttributeCreateValidator.validate({
      title,
      terms,
      category_id, // 👈 Add this here to validate if needed
    });

    if (error) {
      return {
        status: 400,
        body: errorResponse("Validation error", 400, error.details),
      };
    }

    // Add category_id to value before saving
    value.category_id = category_id;

    const newAttribute = await productAttributeService.createProductAttribute(
      value
    );

    await redis.del("allProductAttributes");

    return {
      status: 201,
      body: successResponse(
        newAttribute,
        "Product attribute created successfully"
      ),
    };
  } catch (err) {
    console.error("Create Product Attribute error:", err.message);
    return {
      status: 500,
      body: errorResponse("Server error", 500),
    };
  }
}

export async function getProductAttributes(query) {
  try {
    console.log("Get Product Attributes query:", query);
    const result = await productAttributeService.getAllProductAttributes(query);
    return {
      status: 200,
      body: {
        success: true,
        message: "Product attributes fetched successfully",
        data: result,
      },
    };
  } catch (err) {
    console.error("Get Product Attributes error:", err.message);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}

export async function getProductAttributeByCategoryId(categoryId) {
  try {
    console.log("Get Product Attribute by Category ID:", categoryId);
    const attribute =
      await productAttributeService.getProductAttributeByCategoryId(categoryId);
    if (!attribute) {
      return {
        status: 404,
        body: {
          success: false,
          message: "Product attribute not found for this category",
        },
      };
    }
    return {
      status: 200,
      body: {
        success: true,
        message: "Product attribute fetched successfully",
        data: attribute,
      },
    };
  } catch (err) {
    console.error("Get Product Attribute by Category ID error:", err);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}

export async function getProductAttributeById(id) {
  try {
    const attribute = await productAttributeService.getProductAttributeById(id);
    if (!attribute) {
      return {
        status: 404,
        body: { success: false, message: "Product attribute not found" },
      };
    }
    return {
      status: 200,
      body: {
        success: true,
        message: "Product attribute fetched successfully",
        data: attribute,
      },
    };
  } catch (err) {
    console.error("Get Product Attribute error:", err);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}

export async function updateProductAttribute(id, data) {
  try {
    const title = data.title?.trim();
    const terms = [];

    if (Array.isArray(data.terms)) {
      for (const [index, term] of data.terms.entries()) {
        const termObj = { value: term.value?.trim() || "" };

        console.log(`Processing term #${index}:`, term);

        // Handle image upload or path
        console.log(`Term #${index} image type:`, typeof term.image);

        if (
          term.image &&
          typeof term.image === "object" &&
          term.image instanceof File
        ) {
          try {
            validateImageFile(term.image);
            const imageUrl = await saveFile(term.image, "attribute-images");
            termObj.image = imageUrl; // full path with folder prefix
          } catch (fileError) {
            return {
              status: 400,
              body: {
                success: false,
                message: `Error uploading image for term #${index}`,
                error: fileError.message,
              },
            };
          }
        } else if (typeof term.image === "string") {
          // If image string doesn't start with '/', add folder path prefix
          if (!term.image.startsWith("/")) {
            termObj.image = "/attribute-images/" + term.image;
          } else {
            termObj.image = term.image;
          }
        } else {
          termObj.image = "";
        }

        terms.push(termObj);
      }
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (terms.length) updateData.terms = terms;

    // Validation & DB update same as before
    const { error, value } =
      productAttributeUpdateValidator.validate(updateData);
    if (error) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Validation error",
          details: error.details,
        },
      };
    }

    const existing = await productAttributeService.findByTitle(value.title);
    if (existing && existing._id.toString() !== id) {
      return {
        status: 400,
        body: {
          success: false,
          message: "Product attribute with this title already exists",
        },
      };
    }

    const updated = await productAttributeService.updateProductAttribute(
      id,
      value
    );
    if (!updated) {
      return {
        status: 404,
        body: { success: false, message: "Product attribute not found" },
      };
    }

    // Fix old stored images without folder prefix before returning
    updated.terms = updated.terms.map((term) => {
      if (term.image && !term.image.startsWith("/")) {
        term.image = "/attribute-images/" + term.image;
      }
      return term;
    });

    await redis.del("allProductAttributes");

    return {
      status: 200,
      body: {
        success: true,
        message: "Product attribute updated successfully",
        data: updated,
      },
    };
  } catch (err) {
    console.error("Update Product Attribute error:", err);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}

export async function deleteProductAttribute(id) {
  try {
    const deleted = await productAttributeService.deleteProductAttribute(id);
    if (!deleted) {
      return {
        status: 404,
        body: { success: false, message: "Product attribute not found" },
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Product attribute deleted successfully",
        data: deleted,
      },
    };
  } catch (err) {
    console.error("Delete Product Attribute error:", err);
    return {
      status: 500,
      body: { success: false, message: "Internal server error" },
    };
  }
}
