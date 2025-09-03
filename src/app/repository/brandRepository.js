import Brand from '../models/brand.js';
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from "./crud-repository.js";

class BrandRepository extends CrudRepository {
  constructor() {
    super(Brand);
  }

  async findById(id) {
    try {
      return await Brand.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      console.error('Repo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const brand = new Brand(data);
      return await brand.save();
    } catch (error) {
      console.error('Repo create error:', error);
      throw error;
    }
  }

  async findByName(name) {
    try {
      return await Brand.findOne({ name, deletedAt: null });
    } catch (error) {
      console.error('Repo findByName error:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const BrandModel = mongoose.models.Brand;
      const brand = await BrandModel.findById(id);
      if (!brand) return null;

      brand.set(data);

      // Handle slug regeneration if name is modified
      if (brand.isModified('name')) {
        const baseSlug = slugify(brand.name, { lower: true, strict: true });
        let uniqueSlug;

        do {
          const randomNumber = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${randomNumber}`;
        } while (
          await BrandModel.exists({
            slug: uniqueSlug,
            deletedAt: null,
            _id: { $ne: brand._id },
          })
        );

        brand.slug = uniqueSlug;
      }

      return await brand.save();
    } catch (err) {
      console.error('Repo update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await Brand.findByIdAndDelete(
        id,
        { deletedAt: new Date() },
        { new: true }
      );
    } catch (err) {
      console.error('Repo softDelete error:', err);
      throw err;
    }
  }
}

export default BrandRepository;