"use client";

import axiosInstance from "@/axiosConfig/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk to fetch blog categories
export const fetchBlogCategories = createAsyncThunk(
  "blog/fetchBlogCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/blog-category?limit=100", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data?.body.data.result || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching blog categories"
      );
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blog/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/blog/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data?.body.data || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching blog by ID"
      );
    }
  }
);

export const fetchSubCategoriesByCategoryId = createAsyncThunk(
  "blog/fetchSubCategoriesByCategoryId",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/blog-subcategory/by-category/${categoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching sub-categories"
      );
    }
  }
);

export const fetchBlogBySubCategoryId = createAsyncThunk(
  "blog/fetchBlogBySubCategoryId",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/blog/subcategory/${subCategoryId}/blogs`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response from fetchBlogBySubCategoryId:", response.data);
      return response.data?.body.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching blogs by sub-category"
      );
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "blog/fetchCategoryById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/blog-category/${categoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data?.body.data || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching category by ID"
      );
    }
  }
);

export const fetchSubCategoryById = createAsyncThunk(
  "blog/fetchSubCategoryById",
  async (subCategoryId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/api/blog-subcategory/${subCategoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data?.data || {};
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Error fetching sub-category by ID"
      );
    }
  }
);

const blogCategorySlice = createSlice({
  name: "blogCategory",
  initialState: {
    data: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBlogCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchBlogCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default blogCategorySlice.reducer;
