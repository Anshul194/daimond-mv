import mongoose from 'mongoose';
import Review from '../models/review.js';
import user from '../models/User.js';
import CrudRepository from "./crud-repository.js";

class ReviewRepository extends CrudRepository {
  constructor() {
    super(Review);
  }

  async getAll(filterConditions, sortConditions, page, limit) {
    try {
      const skip = (page - 1) * limit;
      const query = Review.find(filterConditions)
        .populate('user', 'name email avatar')
        // .populate('product', 'name slug price images')
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);

      const results = await query.exec();
      const totalDocuments = await Review.countDocuments(filterConditions);

      return {
        results,
        totalDocuments,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit)
      };
    } catch (error) {
      console.error('ReviewRepo getAll error:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await Review.find({ deletedAt: null })
        .populate('user', 'name email avatar')
        .populate('product', 'name slug price images');
    } catch (error) {
      console.error('ReviewRepo findAll error:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await Review.findOne({ _id: id, deletedAt: null })
        .populate('user', 'name email avatar')
        // .populate('product', 'name slug price images');
    } catch (error) {
      console.error('ReviewRepo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const review = new Review(data);
      const savedReview = await review.save();
      return await savedReview.populate([
        { path: 'user', select: 'name email avatar' },
        // { path: 'product', select: 'name slug price images' }
      ]);
    } catch (error) {
      console.error('ReviewRepo create error:', error);
      throw error;
    }
  }

  // async update(id, data) {
  //   try {
  //     const review = await Review.findById(id);
  //     if (!review) return null;

  //     review.set(data);
  //     const updated = await review.save();
  //     return await updated.populate([
  //       { path: 'user', select: 'name email avatar' },
  //       { path: 'product', select: 'name slug price images' }
  //     ]);
  //   } catch (err) {
  //     console.error('ReviewRepo update error:', err);
  //     throw err;
  //   }
  // }

async update(id, data) {
  try {
    const review = await Review.findById(id);
    if (!review) return null;

    review.set(data);
    await review.save();

    console.log('🔧 Review updated successfully:', review);
    

    const populated = await Review.findById(id)
      .populate('user', 'name email avatar')
      .populate('product', 'name slug price images');
    return populated;
  } catch (err) {
    console.error('ReviewRepo update error:', err);
    throw err;
  }
}



  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await Review.findByIdAndDelete(
        id,
        { deletedAt: new Date() },
        { new: true }
      ).populate([
        { path: 'user', select: 'name email avatar' },
        // { path: 'product', select: 'name slug price images' }
      ]);
    } catch (err) {
      console.error('ReviewRepo softDelete error:', err);
      throw err;
    }
  }

  // Additional methods for specific queries
  async findByProduct(productId, options = {}) {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const query = Review.find({ product: productId, deletedAt: null })
        .populate('user', 'name email avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const results = await query.exec();
      const totalDocuments = await Review.countDocuments({ product: productId, deletedAt: null });

      return {
        results,
        totalDocuments,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit)
      };
    } catch (error) {
      console.error('ReviewRepo findByProduct error:', error);
      throw error;
    }
  }

  async findByUser(userId, options = {}) {
    try {
      const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
      const skip = (page - 1) * limit;

      const query = Review.find({ user: userId, deletedAt: null })
        .populate('product', 'name slug price images')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      const results = await query.exec();
      const totalDocuments = await Review.countDocuments({ user: userId, deletedAt: null });

      return {
        results,
        totalDocuments,
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit)
      };
    } catch (error) {
      console.error('ReviewRepo findByUser error:', error);
      throw error;
    }
  }
}

export default ReviewRepository;