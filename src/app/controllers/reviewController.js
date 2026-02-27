import ReviewService from '../services/reviewService.js';

import { saveFile, validateImageFile } from '../lib/fileUpload.js';
import initRedis from '../config/redis.js';
import { reviewCreateValidator, reviewUpdateValidator } from '../validators/reviewValidator.js';
import { successResponse, errorResponse } from '../utils/response.js';

const reviewService = new ReviewService();

const redis = initRedis();

// Create Review
export async function createReview(request, userId) {
  try {
    console.log('🟢 Starting createReview()');

    let imageUrls = [];
    const form = await request.formData();

    const productId = form.get('product');
    const rating = form.get('rating');
    const comment = form.get('comment');
    const isWebsiteReview = !productId ? true : form.get('isWebsiteReview') === 'true';
    const targetType = productId ? 'product' : 'website';
    const images = form.getAll('images');

    console.log('📥 Form Data Received:', {
      userId,
      productId,
      rating,
      comment,
      isWebsiteReview,
      targetType,
      imagesLength: images.length,
    });

    if (!userId || !rating || !comment) {
      console.warn('⚠️ Missing required fields:', { userId, rating, comment });
      return errorResponse('Missing required fields: rating and comment are required', 400);
    }

    if (images && images.length > 0) {
      console.log('🖼️ Handling image uploads...');
      for (const image of images) {
        if (image instanceof File && image.size > 0) {
          try {
            console.log('🔍 Validating image...');
            validateImageFile(image);

            console.log('💾 Saving image...');
            const imageUrl = await saveFile(image, 'review-images');
            imageUrls.push(imageUrl);

            console.log('✅ Image uploaded successfully:', imageUrl);
          } catch (err) {
            console.warn('⚠️ Image upload skipped:', err.message);
          }
        } else {
          console.log('❌ Invalid image skipped');
        }
      }
    }

    const payload = {
      user: userId.toString(),
      rating: parseInt(rating),
      comment: comment.trim(),
      targetType,
      isWebsiteReview,
      images: imageUrls,
    };

    if (productId) payload.product = productId;

    console.log('🧪 Validating payload:', payload);
    const { error, value } = reviewCreateValidator.validate(payload);

    if (error) {
      console.error('❌ Validation error:', error.details);
      return errorResponse('Validation error', 400, error.details);
    }

    console.log('💾 Creating review in database...');
    const newReview = await reviewService.createReview(value);

    console.log('🧹 Clearing Redis cache...');
    await redis.del('allReviews');

    console.log('✅ Review created successfully:', newReview);

    return successResponse(newReview, 'Review created successfully', 201);
  } catch (err) {
    console.error('❌ createReview error:', err.message, err);
    return errorResponse(`Server error: ${err.message}`, 500);
  }
}


// Get All Reviews
export async function getReviews(query) {
  try {
    const result = await reviewService.getAllReviews(query);
    return successResponse(result, 'Reviews fetched successfully');
  } catch (err) {
    console.error('Get Reviews error:', err.message);
    return errorResponse('Server error', 500);
  }
}

// Update Review Status
export async function updateReviewStatus(id, status) {
  try {
    console.log(`➡️ Updating status for review ${id} to ${status}`);

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return errorResponse('Invalid status. Must be pending, approved, or rejected', 400);
    }

    const updated = await reviewService.updateReview(id, { status });
    if (!updated) {
      return errorResponse('Review not found', 404);
    }

    // Clear Redis cache
    await redis.del('allReviews');

    return successResponse(updated, 'Review status updated successfully');
  } catch (err) {
    console.error('Update Review Status error:', err.message);
    return errorResponse('Server error', 500);
  }
}

// Get Review by ID
export async function getReviewById(id) {
  try {
    const review = await reviewService.getReviewById(id);
    if (!review) {
      return errorResponse('Review not found', 404);
    }

    return successResponse(review, 'Review fetched successfully');
  } catch (err) {
    console.error('Get Review error:', err.message);
    return errorResponse('Server error', 500);
  }
}

// Update Review
export async function updateReview(id, data, userId) {
  try {
    console.log('➡️ Starting review update process');

    // 1. Fetch the review by ID
    const existingReview = await reviewService.getReviewById(id);
    if (!existingReview) {
      return errorResponse('Review not found', 404);
    }

    // 2. Compare owner ID with logged-in user ID
    const ownerId =
      existingReview.user && existingReview.user._id
        ? existingReview.user._id.toString()
        : existingReview.user.toString();

    console.log('🧾 Review owner ID:', ownerId);
    console.log('🔐 Requesting user ID:', userId.toString());



    // 3. Extract fields and handle image uploads
    const { images, ...fields } = data;
    let imageUrls = [];

    if (images && images.length > 0) {
      console.log('🖼️ Processing image uploads...');
      for (const image of images) {
        if (image && image instanceof File && image.size > 0) {
          try {
            validateImageFile(image);
            const imageUrl = await saveFile(image, 'review-images');
            imageUrls.push(imageUrl);
          } catch (imageError) {
            console.warn('⚠️ Image upload failed:', imageError.message);
          }
        }
      }
    }

    // 4. Clean empty or null fields
    const cleanedFields = Object.entries(fields).reduce((acc, [key, value]) => {
      if (value !== null && value !== '' && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // 5. Combine payload with images if any
    const payload = imageUrls.length > 0
      ? { ...cleanedFields, images: imageUrls }
      : cleanedFields;

    // 6. Validate payload
    const { error, value } = reviewUpdateValidator.validate(payload);
    if (error) {
      return errorResponse('Validation error', 400, error.details);
    }

    // 7. Perform the update
    const updated = await reviewService.updateReview(id, value);
    if (!updated) {
      return errorResponse('Review not found', 404);
    }

    // 8. Clear Redis cache
    await redis.del('allReviews');

    // 9. Return success
    return successResponse(updated, 'Review updated successfully');
  } catch (err) {
    console.error('Update Review error:', err.message);
    return errorResponse('Server error', 500);
  }
}


// Delete Review
export async function deleteReview(id, userId) {
  try {
    console.log('➡️ con Starting review delete process');

    // Fetch review and populate user field (assuming reviewService.getReviewById does this)
    const existingReview = await reviewService.getReviewById(id);
    console.log('🔍 Fetched existing review:', existingReview);


    if (!existingReview) {
      return errorResponse('Review not found', 404);
    }

    // Determine owner user id, handle if populated or not
    const ownerId = existingReview.user && existingReview.user._id
      ? existingReview.user._id.toString()
      : existingReview.user.toString();

    console.log('Review owner ID:', ownerId);
    console.log('User requesting delete ID:', userId);



    // Attempt to delete review
    const deleted = await reviewService.deleteReview(id);

    if (!deleted) {
      return errorResponse('Review not found', 404);
    }

    // Clear relevant cache
    await redis.del('allReviews');

    return successResponse({ id }, 'Review deleted successfully');
  } catch (err) {
    console.error('Delete Review error:', err.message);
    return errorResponse('Server error', 500);
  }
}
