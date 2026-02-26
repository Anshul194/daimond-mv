import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const storySchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: 'Your story, our craft.'
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        default: 'video'
    },
    mediaUrl: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    deletedAt: {
        type: Date,
        default: null,
    }
}, {
    timestamps: true,
});

const Story = models.Story || model('Story', storySchema);
export default Story;
