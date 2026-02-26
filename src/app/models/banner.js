import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const bannerSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    image: {
        type: String, // Left background image
        required: true,
    },
    rightImage: {
        type: String, // Right background image
    },
    label: {
        type: String, // e.g. "9,642 Trusted Reviews"
    },
    buttonPrimaryText: {
        type: String,
    },
    buttonPrimaryLink: {
        type: String,
    },
    buttonSecondaryText: {
        type: String,
    },
    buttonSecondaryLink: {
        type: String,
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
    mobileButton1Text: {
        type: String,
        trim: true,
    },
    mobileButton1Link: {
        type: String,
        trim: true,
    },
    mobileButton2Text: {
        type: String,
        trim: true,
    },
    mobileButton2Link: {
        type: String,
        trim: true,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

const Banner = models.Banner || model('Banner', bannerSchema);
export default Banner;
