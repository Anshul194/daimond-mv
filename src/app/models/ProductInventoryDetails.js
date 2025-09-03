import mongoose from 'mongoose';
import ColorCode from './ColorCode';    

const { Schema, model, models } = mongoose;

const productInventoryDetailSchema = new Schema({
    product_inventory_id: {
        type: Schema.Types.ObjectId,
        ref: 'ProductInventory',
        required: true,
    },
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    color: {
        type: Schema.Types.ObjectId,
        ref: 'ColorCode',
        default: null,
    },
    size: {
        type: Schema.Types.ObjectId,
        ref: 'Size',
        default: null,
    },
    hash: {
        type: String,
        default: '',
    },
    additional_price: {
        type: Number,
        default: 0.00,
    },
    add_cost: {
        type: Number,
        default: null,
    },
    image: {
        type: [String], // Changed to array of strings to support multiple images
        default: [],
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
    timestamps: true
});

// Indexes for faster querying
productInventoryDetailSchema.index({ product_inventory_id: 1 });
productInventoryDetailSchema.index({ product_id: 1 });

const ProductInventoryDetail = models.ProductInventoryDetail || model('ProductInventoryDetail', productInventoryDetailSchema);

export default ProductInventoryDetail;