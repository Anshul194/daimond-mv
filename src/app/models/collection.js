import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Collection name is required'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    order: {
        type: Number,
        default: 0
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Collection = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);

export default Collection;
