import Size from '../models/size.js';
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from "./crud-repository.js";

class SizeRepository extends CrudRepository {
  constructor() {
    super(Size);
  }

  async findById(id) {
    try {
      return await Size.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      console.error('Repo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      // Generate slug from name
      const baseSlug = slugify(data.name, { lower: true, strict: true });
      let uniqueSlug = baseSlug;
      
      // Check for existing slug and make it unique
      let counter = 1;
      while (await Size.exists({ slug: uniqueSlug, deletedAt: null })) {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      const sizeData = { ...data, slug: uniqueSlug };
      const size = new Size(sizeData);
      return await size.save();
    } catch (error) {
      console.error('Repo create error:', error);
      throw error;
    }
  }

  async findByName(name, vendor = null) {
    try {
      const filter = { name, deletedAt: null };
      if (vendor) filter.vendor = vendor;
      return await Size.findOne(filter);
    } catch (error) {
      console.error('Repo findByName error:', error);
      throw error;
    }
  }

  async findBySizeCode(size_code, vendor = null) {
    try {
      const filter = { size_code, deletedAt: null };
      if (vendor) filter.vendor = vendor;
      return await Size.findOne(filter);
    } catch (error) {
      console.error('Repo findBySizeCode error:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const SizeModel = mongoose.models.Size;
      const size = await SizeModel.findById(id);
      if (!size) return null;

      size.set(data);

      // Update slug if name is modified
      if (size.isModified('name')) {
        const baseSlug = slugify(size.name, { lower: true, strict: true });
        let uniqueSlug;

        do {
          const randomNumber = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${randomNumber}`;
        } while (
          await SizeModel.exists({
            slug: uniqueSlug,
            deletedAt: null,
            _id: { $ne: size._id },
          })
        );

        size.slug = uniqueSlug;
      }

      return await size.save();
    } catch (err) {
      console.error('Repo update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await Size.findByIdAndDelete(
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

export default SizeRepository;