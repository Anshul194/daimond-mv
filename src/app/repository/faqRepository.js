// repository/faqRepository.js
import Faq from '../models/faq.js';
import CrudRepository from './crud-repository.js';

class FaqRepository extends CrudRepository {
  constructor() {
    super(Faq);
  }

  async findById(id) {
    try {
      return await Faq.findOne({ _id: id, deletedAt: null });
    } catch (error) {
      console.error('Repo findById error:', error);
      throw error;
    }
  }

  async create(data) {
    try {
      const faq = new Faq(data);
      return await faq.save();
    } catch (error) {
      console.error('Repo create error:', error);
      throw error;
    }
  }

  async findByTitle(title) {
  try {
    return await this.model.findOne({ title: title, deletedAt: null });
  } catch (error) {
    console.error('Repo findByTitle error:', error);
    throw error;
  }
}


  async update(id, data) {
    try {
      const faq = await Faq.findById(id);
      if (!faq || faq.deletedAt) return null;

      faq.set(data);
      return await faq.save();
    } catch (error) {
      console.error('Repo update error:', error);
      throw error;
    }
  }

  async softDelete(id) {
    try {
      return await Faq.findByIdAndDelete(id, { deletedAt: new Date() }, { new: true });
    } catch (error) {
      console.error('Repo softDelete error:', error);
      throw error;
    }
  }

  // findAll without pagination: returns all matching records
 async findAll(filter = {}, sort = {}, skip = 0, limit = 10) {
    try {
      return await Faq.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    } catch (error) {
      console.error('Repo findAll error:', error);
      throw error;
    }
  }

  async countDocuments(filter = {}) {
    try {
      return await Faq.countDocuments(filter);
    } catch (error) {
      console.error('Repo countDocuments error:', error);
      throw error;
    }
  }

}

export default FaqRepository;
