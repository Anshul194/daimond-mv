// controllers/faqController.js
import FaqService from '../services/faqService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { faqCreateValidator, faqUpdateValidator } from '../validators/Faqvalidation.js';
import initRedis from '../config/redis.js';

const faqService = new FaqService();
const redis = initRedis();

export async function createFaq(data) {
  try {
    // Directly use data properties instead of form.get()
    const faqData = {
      title: data.title,
      description: data.description,
      status: data.status || undefined,
    };

    const { error, value } = faqCreateValidator.validate(faqData);
    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    // Check if FAQ with same title exists
    const existing = await faqService.findByTitle(value.title);
    if (existing) {
      return {
        status: 400,
        body: errorResponse('FAQ with this title already exists', 400),
      };
    }

    const faq = await faqService.createFaq(value);

    await redis.del('allFaqs');

    return {
      status: 201,
      body: successResponse(faq, 'FAQ created'),
    };
  } catch (err) {
    console.error('Create FAQ error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}


export async function getFaqs(query) {
  try {
    const faqs = await faqService.getAllFaqs(query);

    return {
      status: 200,
      body: successResponse(faqs, 'FAQs fetched'),
    };
  } catch (err) {
    console.error('Get FAQs error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}

export async function getFaqById(id) {
  try {
    const faq = await faqService.getFaqById(id);
    if (!faq) {
      return {
        status: 404,
        body: errorResponse('FAQ not found', 404),
      };
    }
    return {
      status: 200,
      body: successResponse(faq, 'FAQ fetched'),
    };
  } catch (err) {
    console.error('Get FAQ by ID error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}

export async function updateFaq(id, data) {
  try {
    const { error, value } = faqUpdateValidator.validate(data);
    if (error) {
      return {
        status: 400,
        body: errorResponse('Validation error', 400, error.details),
      };
    }

    const updatedFaq = await faqService.updateFaq(id, value);
    if (!updatedFaq) {
      return {
        status: 404,
        body: errorResponse('FAQ not found', 404),
      };
    }

    // Invalidate cache if FAQs are cached
    await redis.del('allFaqs');

    return {
      status: 200,
      body: successResponse(updatedFaq, 'FAQ updated'),
    };
  } catch (err) {
    console.error('Update FAQ error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}

export async function deleteFaq(id) {
  try {
    const deletedFaq = await faqService.deleteFaq(id);
    if (!deletedFaq) {
      return {
        status: 404,
        body: errorResponse('FAQ not found', 404),
      };
    }

    // Invalidate cache if FAQs are cached
    await redis.del('allFaqs');

    return {
      status: 200,
      body: successResponse(deletedFaq, 'FAQ deleted'),
    };
  } catch (err) {
    console.error('Delete FAQ error:', err.message);
    return {
      status: err.statusCode || 500,
      body: errorResponse(err.message || 'Server error'),
    };
  }
}
