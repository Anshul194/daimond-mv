import mongoose from 'mongoose';

const HomeStatSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true,
        trim: true
    },
    value: {
        type: Number,
        required: true
    },
    suffix: {
        type: String,
        default: '+'
    },
    float: {
        type: Boolean,
        default: false
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

export default mongoose.models.HomeStat || mongoose.model('HomeStat', HomeStatSchema);
