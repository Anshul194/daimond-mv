import Coupon from '../models/coupon.js';
import CrudRepository from './crud-repository.js';

class CouponRepository extends CrudRepository {
  constructor() {
    super(Coupon);
  }

    async findById(id) {
        return this.model.findById(id);
    }

    async findByCode(code) {
        return this.model.findOne({ code });
    }

    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async getAllCoupons(filter = {}, sort = {}, page = 1, limit = 10, populate = [], select = {}) {
    return this.getAll(filter, sort, page, limit, populate, select);
  }

    async delete(id) {
        // Hard delete: permanently remove the document
        return this.model.findByIdAndDelete(id);
    }
}

export default CouponRepository;