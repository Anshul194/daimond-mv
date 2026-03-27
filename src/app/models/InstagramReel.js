import mongoose from 'mongoose';

const InstagramReelSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true
    },
    reelUrl: {
        type: String,
        required: true,
        trim: true
    },
    order: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

export default mongoose.models.InstagramReel || mongoose.model('InstagramReel', InstagramReelSchema);
