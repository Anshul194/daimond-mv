import TaxClassService from '../services/taxClassService.js';
import initRedis from '../config/redis.js';
import { successResponse, errorResponse } from '../utils/response.js';

const taxClassService = new TaxClassService();
const redis = initRedis();

export async function createTaxClass(data) {
  try {
    const { name } = data;

    const exists = await taxClassService.findByName(name);
    if (exists) {
      return { status: 400, body: errorResponse('Tax class with this name already exists', 400) };
    }

    const created = await taxClassService.createTaxClass(data);
    await redis.del('allTaxClasses');

    return { status: 201, body: successResponse(created, 'Tax class created') };
  } catch (err) {
    console.error('Create TaxClass error:', err.message);
    return { status: 500, body: errorResponse('Server error', 500) };
  }
}

export async function getTaxClasses(query) {
  try {
    const data = await taxClassService.getAllTaxClasses(query);
    return { status: 200, body: successResponse(data, 'Tax classes fetched') };
  } catch (err) {
    console.error('Get TaxClasses error:', err.message);
    return { status: 500, body: errorResponse('Server error', 500) };
  }
}

export async function getTaxClassById(id) {
  try {
    const data = await taxClassService.getTaxClassById(id);
    if (!data) return { status: 404, body: errorResponse('Tax class not found', 404) };
    return { status: 200, body: successResponse(data, 'Tax class fetched') };
  } catch (err) {
    console.error('Get TaxClass error:', err.message);
    return { status: 500, body: errorResponse('Server error', 500) };
  }
}

export async function updateTaxClass(id, data) {
  try {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== null && v !== undefined && v !== '')
    );

    const updated = await taxClassService.updateTaxClass(id, cleanData);
    if (!updated) return { status: 404, body: errorResponse('Tax class not found', 404) };

    await redis.del('allTaxClasses');
    return { status: 200, body: successResponse(updated, 'Tax class updated') };
  } catch (err) {
    console.error('Update TaxClass error:', err.message);
    return { status: 500, body: errorResponse('Server error', 500) };
  }
}

export async function deleteTaxClass(id) {
  try {
    const deleted = await taxClassService.softDelete(id);
    if (!deleted) return { status: 404, body: errorResponse('Tax class not found', 404) };

    await redis.del('allTaxClasses');
    return { status: 200, body: successResponse(deleted, 'Tax class deleted') };
  } catch (err) {
    console.error('Delete TaxClass error:', err.message);
    return { status: 500, body: errorResponse('Server error', 500) };
  }
}
