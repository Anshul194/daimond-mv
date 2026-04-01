import axiosInstance from "@/axiosConfig/axiosInstance";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setCredentials } from "./auth";
const initialState = {
  loading: false,
  error: null,
  data: null,
};

export const checkout = createAsyncThunk(
  "checkout/submit",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.post(
        "/api/order",
        {
          ...data,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resp = response.data;

      // If server created a guest user and returned tokens, store them in auth slice
      const payload = resp?.data;
      if (payload?.user_id) {
        const tokens = payload.tokens || {};
        // Store minimal user object; app can fetch full user later
        dispatch(
          setCredentials({
            user: { _id: payload.user_id },
            token: tokens.accessToken || null,
            refreshToken: tokens.refreshToken || null,
          })
        );
      }

      localStorage.removeItem("cart");
      return resp;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default checkoutSlice.reducer;
