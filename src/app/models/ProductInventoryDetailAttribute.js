import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const productInventoryDetailAttributeSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    inventory_details_id: {
        type: Schema.Types.ObjectId,
        ref: 'InventoryDetail',
        required: true,
    },
    attribute_name: {
        type: String,
        trim: true,
        default: '',
    },
    attribute_value: {
        type: String,
        trim: true,
        default: '',
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true
});

// Indexes for faster querying
productInventoryDetailAttributeSchema.index({ product_id: 1 });
productInventoryDetailAttributeSchema.index({ inventory_details_id: 1 });

const ProductInventoryDetailAttribute = models.ProductInventoryDetailAttribute ||
    model('ProductInventoryDetailAttribute', productInventoryDetailAttributeSchema);

export default ProductInventoryDetailAttribute;
