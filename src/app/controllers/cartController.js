import CartService from '../services/cartService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import dbConnect from '../lib/mongodb.js';

const cartService = new CartService();

export async function addToCart(formData) {
  try {
    // Parse form data
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Validate required fields
    if (!data.product_id || !data.quantity) {
      return {
        status: 400,
        body: errorResponse('Product ID and quantity are required', 400),
      };
    }

    // Assume userId is available (from middleware or token)
    const userId = data.user_id || '65c8f1b2c7f8e9a0b0c7e1a2'; // Replace with actual user ID from auth

    const cart = await cartService.addToCart(userId, data);

    // Prepare response
    const responseData = {
      type: 'success',
      msg: 'Item added to cart',
      cart_content: cart.items,
      // header_area: '', // Implement view rendering if needed
    };

    return {
      status: 200,
      body: successResponse(responseData, 'Item added to cart'),
    };
  } catch (err) {
    console.error('Add to Cart error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}

export async function getCart(userId) {
  try {
    const cart = await cartService.getCart(userId);
    return {
      status: 200,
      body: successResponse(cart, 'Cart fetched successfully'),
    };
  } catch (err) {
    console.error('Get Cart error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}