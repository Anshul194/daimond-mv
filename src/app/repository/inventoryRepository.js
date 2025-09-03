// repository/productRepository.js
import ProductInventory from '../models/ProductInventory.js';

import CrudRepository from './crud-repository.js';

class ProductRepository extends CrudRepository {
    constructor() {
        super(Product);
    }

    async findById(id) {
        try {
            return await Product.findOne({ _id: id, deletedAt: null });
        } catch (error) {
            console.error('Repo findById error:', error);
            throw error;
        }
    }

    async create(data) {
        try {
            const product = new Product(data);
            return await product.save();
        } catch (error) {
            console.error('Repo create error:', error);
            throw error;
        }
    }

    async findByName(title) {
        try {
            return await this.model.findOne({ name: title, deletedAt: null });
        } catch (error) {
            console.error('Repo findByName error:', error);
            throw error;
        }
    }

    async update(id, data) {
        try {
            const product = await Product.findById(id);
            if (!product || product.deletedAt) return null;

            product.set(data);
            return await product.save();
        } catch (error) {
            console.error('Repo update error:', error);
            throw error;
        }
    }

    async softDelete(id) {
        try {
            return await Product.findByIdAndUpdate(
                id,
                { deletedAt: new Date() },
                { new: true }
            );
        } catch (error) {
            console.error('Repo softDelete error:', error);
            throw error;
        }
    }

    // findAll without pagination: returns all matching records
    async findAll(filter = {}, sort = {}, skip = 0, limit = 10) {
        try {
            return await Product.find(filter)
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
            return await Product.countDocuments(filter);
        } catch (error) {
            console.error('Repo countDocuments error:', error);
            throw error;
        }
    }
}

export default ProductRepository;
