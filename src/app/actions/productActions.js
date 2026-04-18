"use server";

import dbConnect from "../lib/mongodb.js";
import { createProduct } from "../controllers/productController.js";
import { withUserAction } from "../middleware/withUserAction.js";

/**
 * Server Action to create a product with support for large file uploads (>10MB).
 * This respects the experimental.serverActions.bodySizeLimit: '100mb' config.
 */
export async function createProductAction(formData) {
  try {
    await dbConnect();
    
    // Validate user via a helper designed for Server Actions
    const { user, error } = await withUserAction("admin");
    if (error) {
      return { success: false, message: "Unauthorized", status: 401 };
    }

    // Call the existing controller logic
    // Controller logic is already designed to handle FormData
    const result = await createProduct(formData, user);
    
    // Return the response
    return { 
      success: true, 
      status: result.status, 
      body: JSON.parse(JSON.stringify(result.body)) // Ensure data is plain object for client return
    };

  } catch (err) {
    console.error("createProductAction error:", err);
    return { 
      success: false, 
      message: err.message || "Failed to create product", 
      error: err.toString(),
      status: 500 
    };
  }
}
