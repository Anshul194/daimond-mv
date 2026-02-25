import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosConfig/axiosInstance";

// Helper function to convert sort format to query string format
const convertSortToQueryString = (sortValue) => {
  if (!sortValue || sortValue === "") {
    return undefined;
  }

  // Handle special sort options
  if (sortValue === "best_sellers") {
    return "BEST";
  }

  if (sortValue === "newest") {
    return "NEWEST";
  }

  // Handle format like "price_asc", "price_desc", etc.
  if (sortValue.includes("_")) {
    const [field, direction] = sortValue.split("_");
    if (field === "price") {
      return direction === "asc" ? "PRICE_LOW_TO_HIGH" : "PRICE_HIGH_TO_LOW";
    }
  }

  return undefined;
};

// Async thunk to fetch products by category
export const fetchProductsByCategory = createAsyncThunk(
  "product/fetchByCategory",
  async (data, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Add sort parameter
      if (data.sort) {
        const sortValue = convertSortToQueryString(data.sort);
        if (sortValue) {
          params.append("sort_by", sortValue);
        }
      }

      // Handle category IDs - include or exclude
      if (data.includeCategoryIds && Array.isArray(data.includeCategoryIds) && data.includeCategoryIds.length > 0) {
        params.append("include_category_ids", data.includeCategoryIds.join(","));
      }

      if (data.excludeCategoryIds && Array.isArray(data.excludeCategoryIds) && data.excludeCategoryIds.length > 0) {
        params.append("exclude_category_ids", data.excludeCategoryIds.join(","));
      }

      // If single categoryId is provided, add it to include_category_ids
      if (data.categoryId && !data.includeCategoryIds) {
        params.append("include_category_ids", data.categoryId);
      }

      // Add in-stock filter
      if (data.inStock) {
        params.append("in_stock", "yes");
      }

      // Add page parameter
      if (data.page) {
        params.append("page", data.page);
      }

      if (data.limit) {
        params.append("limit", data.limit);
      }

      // Add price range filters
      if (data.priceMin !== undefined) {
        params.append("price_min", data.priceMin);
      }
      if (data.priceMax !== undefined) {
        params.append("price_max", data.priceMax);
      }

      // Add carat range filters
      if (data.caratMin !== undefined) {
        params.append("carat_min", data.caratMin);
      }
      if (data.caratMax !== undefined) {
        params.append("carat_max", data.caratMax);
      }

      // Add attribute filters (shape, metal, stones)
      if (data.attributeFilter && data.attributeFilter.length > 0) {
        // Assuming attributeFilter is an array of attribute IDs or values
        params.append("attribute_filters", data.attributeFilter.join(","));
      }

      // Add subcategory filter if provided
      if (data.subCategory) {
        params.append("subcategory_id", data.subCategory);
      }

      // Add gender filter
      if (data.gender) {
        params.append("gender", data.gender);
      }

      const finalUrl = `/api/product?${params.toString()}`;
      console.log('Fetching products from URL:', finalUrl);
      console.log('API Request params:', Object.fromEntries(params));

      const response = await axiosInstance.get("/api/product", {
        params,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      });
      console.log("response of engagement rings", response.data);
      return {
        items: response.data?.body?.data?.docs || [],
        pagination: {
          currentPage: response.data?.body?.data?.page || 1,
          totalPages: response.data?.body?.data?.totalPages || 0,
          totalItems: response.data?.body?.data?.total || 0,
          itemsPerPage: response.data?.body?.data?.itemsPerPage || 10,
        },
      };
    } catch (err) {
      console.log("Error fetching products:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductsByCategoryWithPagination = createAsyncThunk(
  "product/fetchByCategoryWithPagination",
  async ({ categoryId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/api/product", {
        params: {
          filters: JSON.stringify({ category_id: categoryId }),
          page,
          limit,
        },
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data?.body?.data?.docs;
    } catch (err) {
      console.log("Error fetching products with pagination:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/api/product/${productId}`, {
        headers: {
          "content-type": "application/json",
        },
      });
      const productData = response.data?.body?.data;
      // Mark that detailed data has been loaded
      return { ...productData, detailedDataLoaded: true };
    } catch (err) {
      console.log("Error fetching product by id:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchProductsByAttribute = createAsyncThunk(
  "product/fetchByAttribute",
  async (
    { attributeName, attributeValue, page = 1, limit = 10 },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get("/api/product-by-attribute", {
        params: {
          attribute_name: attributeName,
          attribute_value: attributeValue,
          page,
          limit,
        },
        headers: {
          "content-type": "application/json",
        },
      });
      return response.data?.body?.data?.docs;
    } catch (err) {
      console.log("Error fetching products by attribute:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch products"
      );
    }
  }
);

export const getMoreProducts = createAsyncThunk(
  "product/getMoreProducts",
  async ({ categoryId, page = 1, limit = 10, sort, inStock, subCategory, attributeFilter, priceMin, priceMax, caratMin, caratMax, includeCategoryIds, excludeCategoryIds, gender }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      // Add sort parameter
      if (sort) {
        const sortValue = convertSortToQueryString(sort);
        if (sortValue) {
          params.append("sort_by", sortValue);
        }
      }

      // Handle category IDs - include or exclude
      if (includeCategoryIds && Array.isArray(includeCategoryIds) && includeCategoryIds.length > 0) {
        params.append("include_category_ids", includeCategoryIds.join(","));
      }

      if (excludeCategoryIds && Array.isArray(excludeCategoryIds) && excludeCategoryIds.length > 0) {
        params.append("exclude_category_ids", excludeCategoryIds.join(","));
      }

      // If single categoryId is provided, add it to include_category_ids
      if (categoryId && !includeCategoryIds) {
        params.append("include_category_ids", categoryId);
      }

      // Add in-stock filter
      if (inStock) {
        params.append("in_stock", "yes");
      }

      if (page) {
        params.append("page", page);
      }

      if (limit) {
        params.append("limit", limit);
      }

      // Add price range filters
      if (priceMin !== undefined) {
        params.append("price_min", priceMin);
      }
      if (priceMax !== undefined) {
        params.append("price_max", priceMax);
      }

      // Add carat range filters
      if (caratMin !== undefined) {
        params.append("carat_min", caratMin);
      }
      if (caratMax !== undefined) {
        params.append("carat_max", caratMax);
      }

      // Add attribute filters
      if (attributeFilter && attributeFilter.length > 0) {
        params.append("attribute_filters", attributeFilter.join(","));
      }

      // Add subcategory filter if provided
      if (subCategory) {
        params.append("subcategory_id", subCategory);
      }

      // Add gender filter
      if (gender) {
        params.append("gender", gender);
      }

      const response = await axiosInstance.get("/api/product", {
        params,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      });
      return response.data?.body?.data?.docs;
    } catch (err) {
      console.log("Error fetching more products:", err);
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to load more products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
    },
    // Track individual product loading states
    productLoadingStates: {}, // { productId: boolean }
    productErrors: {}, // { productId: errorMessage }
  },
  reducers: {
    // Clear individual product errors
    clearProductError: (state, action) => {
      const productId = action.payload;
      delete state.productErrors[productId];
    },
    // Clear all errors
    clearAllErrors: (state) => {
      state.error = null;
      state.productErrors = {};
    },
    clearState: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
      state.productLoadingStates = {};
      state.productErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Clear existing products when starting a new fetch
        state.items = [];
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        console.log(
          "fetchProductsByCategory fulfilled with data:",
          action.payload
        );
        state.loading = false;
        // Replace items with new data (don't append)
        state.items = action.payload.items || [];
        state.pagination = action.payload.pagination || {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch individual product by ID
      .addCase(fetchProductById.pending, (state, action) => {
        const productId = action.meta.arg;
        state.productLoadingStates[productId] = true;
        // Clear any previous error for this product
        delete state.productErrors[productId];
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const product = action.payload;
        const productId = action.meta.arg;

        // Clear loading state
        state.productLoadingStates[productId] = false;

        // Update or add the product with detailed data
        const existingProductIndex = state.items.findIndex(
          (item) => item._id === product._id
        );
        if (existingProductIndex !== -1) {
          // Update existing product with detailed data
          state.items[existingProductIndex] = product;
        } else {
          // Add new product to items
          state.items.push(product);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        const productId = action.meta.arg;
        state.productLoadingStates[productId] = false;
        state.productErrors[productId] = action.payload;
      })
      // Fetch products by attribute
      .addCase(fetchProductsByAttribute.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByAttribute.fulfilled, (state, action) => {
        state.loading = false;
        // If the payload is an array, merge it with existing items
        if (Array.isArray(action.payload)) {
          state.items = [...action.payload];
        } else {
          state.items = action.payload || [];
        }
      })
      .addCase(fetchProductsByAttribute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMoreProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMoreProducts.fulfilled, (state, action) => {
        state.loading = false;
        // If the payload is an array, append it to existing items
        if (Array.isArray(action.payload)) {
          state.items = [...state.items, ...action.payload];
        } else {
          state.items = [...state.items, ...(action.payload || [])];
        }
      })
      .addCase(getMoreProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, clearAllErrors, clearState } =
  productSlice.actions;

// Selectors
export const selectProductById = (state, productId) =>
  console.log("selectProductById called with productId:", productId) ||
  state.product.items.find((item) => item._id === productId);

export const selectProductLoadingState = (state, productId) =>
  state.product.productLoadingStates[productId] || false;

export const selectProductError = (state, productId) =>
  state.product.productErrors[productId] || null;

export default productSlice.reducer;
