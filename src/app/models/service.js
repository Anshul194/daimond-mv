import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const serviceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String, // Background image
        required: true,
    },
    alt: {
        type: String, // Alt text for image
        trim: true,
    },
    link: {
        type: String, // Navigation link
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    order: {
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

const Service = models.Service || model('Service', serviceSchema);
export default Service;
