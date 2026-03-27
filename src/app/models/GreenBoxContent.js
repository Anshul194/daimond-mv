import mongoose from 'mongoose';

const GreenBoxContentSchema = new mongoose.Schema({
    eyebrow: {
        type: String,
        default: 'Est. Since'
    },
    headlineLine1: {
        type: String,
        required: true
    },
    headlineLine2: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

export default mongoose.models.GreenBoxContent || mongoose.model('GreenBoxContent', GreenBoxContentSchema);
