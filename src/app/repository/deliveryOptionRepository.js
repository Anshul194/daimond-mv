import DeliveryOption from '../models/deliveryOption.js';
import mongoose from 'mongoose';
import slugify from 'slugify';
import CrudRepository from "./crud-repository.js";

class DeliveryOptionRepository extends CrudRepository {
  constructor() {
    super(DeliveryOption);
  }

  async findById(id) {
    try {
      return await DeliveryOption.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      console.error('Repo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const deliveryOption = new DeliveryOption(data);
      return await deliveryOption.save();
    } catch (error) {
      console.error('Repo create error:', error);
      throw error;
    }
  }

  async findByTitle(title) {
    try {
      return await DeliveryOption.findOne({ title, deletedAt: null });
    } catch (error) {
      console.error('Repo findByTitle error:', error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const DeliveryOptionModel = mongoose.models.DeliveryOption;
      const deliveryOption = await DeliveryOptionModel.findById(id);
      if (!deliveryOption) return null;

      deliveryOption.set(data);

      if (deliveryOption.isModified('title')) {
        const baseSlug = slugify(deliveryOption.title, { lower: true, strict: true });
        let uniqueSlug;

        do {
          const randomNumber = Math.floor(100 + Math.random() * 900);
          uniqueSlug = `${baseSlug}-${randomNumber}`;
        } while (
          await DeliveryOptionModel.exists({
            slug: uniqueSlug,
            deletedAt: null,
            _id: { $ne: deliveryOption._id },
          })
        );

        deliveryOption.slug = uniqueSlug;
      }

      return await deliveryOption.save();
    } catch (err) {
      console.error('Repo update error:', err);
      throw err;
    }
  }

  async softDelete(id) {
    try {
      console.log('Repo softDelete called with:', id);
      return await DeliveryOption.findByIdAndDelete(
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

export default DeliveryOptionRepository;