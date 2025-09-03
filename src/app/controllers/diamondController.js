import DiamondService from '../services/diamondService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import initRedis from '../config/redis';

const diamondService = new DiamondService();
const redis = initRedis();

export async function getDiamonds(query) {
  try {
    const diamonds = await diamondService.getAllDiamonds(query);

    return {
      status: 200,
      body: successResponse(diamonds, 'Diamonds fetched successfully'),
    };
  } catch (err) {
    console.error('Get Diamonds error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}
