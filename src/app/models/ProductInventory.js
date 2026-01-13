import mongoose from 'mongoose';
import slugify from 'slugify';
import Product from './Product.js'; // Assuming Product model is defined in Product.js

const { Schema, model, models } = mongoose;

const productInventorySchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    sku: {
        type: String,
        // required: true,
        unique: true,
        sparse: true, // Allow multiple null values
        trim: true,
    },
    stock_count: {
        type: Number,
        default: 0,
    },
    sold_count: {
        type: Number,
        default: 0,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

// Indexes for faster querying
// Sparse unique index: allows multiple null values but enforces uniqueness for non-null values
productInventorySchema.index({ sku: 1 }, { unique: true, sparse: true });
productInventorySchema.index({ product: 1 });

const ProductInventory = models.ProductInventory || model('ProductInventory', productInventorySchema);

export default ProductInventory;
