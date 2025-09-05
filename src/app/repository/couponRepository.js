import Coupon from '../models/coupon.js';
import CrudRepository from './crud-repository.js';

class CouponRepository extends CrudRepository {
  constructor() {
    super(Coupon);
  }

  async findById(id) {
    return this.model.findOne({ _id: id, deletedAt: null });
  }

  async findByCode(code, vendor = null) {
    const filter = { code, deletedAt: null };
    if (vendor) filter.vendor = vendor;
    return this.model.findOne(filter);
  }

  async findByCodeForValidation(code) {
    // For validation, we might need to check across all vendors
    return this.model.findOne({ code, deletedAt: null });
  }

  async create(data) {
    const coupon = new this.model(data);
    return await coupon.save();
  }

  async update(id, data) {
    return this.model.findOneAndUpdate(
      { _id: id, deletedAt: null }, 
      data, 
      { new: true }
    );
  }

  async getAllCoupons(filter = {}, sort = {}, page = 1, limit = 10, populate = [], select = {}) {
    // Add deletedAt null filter
    const filterConditions = { ...filter, deletedAt: null };
    return this.getAll(filterConditions, sort, page, limit, populate, select);
  }

  async softDelete(id) {
    return this.model.findByIdAndUpdate(
      id,
      { deletedAt: new Date(), deleted: true },
      { new: true }
    );
  }

  async delete(id) {
    // Soft delete: set deletedAt timestamp
    return this.softDelete(id);
  }
}

export default CouponRepository;