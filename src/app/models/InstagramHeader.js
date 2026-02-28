import mongoose from 'mongoose';

const InstagramHeaderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'Instagram'
    },
    description: {
        type: String,
        required: true,
        trim: true,
        default: 'Learn, engage and grow. Connect with Cullen for all things engagement, wedding and fine jewellery.'
    }
}, {
    timestamps: true
});

export default mongoose.models.InstagramHeader || mongoose.model('InstagramHeader', InstagramHeaderSchema);
