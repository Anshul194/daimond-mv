import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import BlogCategory from "../models/BlogCategory.js";
import BlogSubCategory from "../models/BlogSubCategory.js";
import { successResponse, errorResponse } from "../utils/response.js"; // optional
import { NextResponse } from "next/server";

export const unifiedSearchController = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("searchproductandblog")?.trim();

    if (!query) {
      return {
        status: 400,
        body: errorResponse("Search query is required"),
      };
    }

    // Try finding matching products
    const products = await Product.find({
      deletedAt: null,
      name: { $regex: query, $options: "i" },
    })
      .select("name slug price saleprice image category_id")
      .populate("category_id", "title")
      .limit(10);

    if (products.length > 0) {
      return {
        status: 200,
        body: successResponse(
          { products },
          "Product search results fetched successfully"
        ),
      };
    }

    // If no products found, try searching blogs
    const blogs = await Blog.find({
      deletedAt: null,
      title: { $regex: query, $options: "i" },
    })
      .select("title slug coverImage BlogCategory")
      .populate("BlogCategory", "title")
      .limit(10);

    if (blogs.length > 0) {
      return {
        status: 200,
        body: successResponse(
          { blogs },
          "Blog search results fetched successfully"
        ),
      };
    }

    const blogSubCategories = await BlogSubCategory.find({
      deletedAt: null,
      name: { $regex: query, $options: "i" },
    })
      .select("name slug image BlogCategory")
      .populate("BlogCategory", "title")
      .limit(10);

    if (blogSubCategories.length > 0) {
      return {
        status: 200,
        body: successResponse(
          { blogSubCategories },
          "Blog SubCategory search results fetched successfully"
        ),
      };
    }

    // If nothing is found in both
    return {
      status: 404,
      body: errorResponse("No matching products or blogs found"),
    };
  } catch (error) {
    console.error("Search Controller Error:", error);
    return {
      status: 500,
      body: errorResponse("Something went wrong"),
    };
  }
};
