import Story from '../models/story.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';

export const createStory = async (request) => {
    try {
        const form = await request.formData();
        const data = {
            title: form.get('title'),
            mediaType: form.get('mediaType') || 'video',
            status: form.get('status') || 'active',
        };

        const mediaFile = form.get('media');
        if (mediaFile && mediaFile instanceof File && mediaFile.size > 0) {
            // For now, we use saveFile which handles uploads to public/uploads
            // We might need to handle video differently if validation is strict
            if (data.mediaType === 'image') {
                validateImageFile(mediaFile);
            }
            data.mediaUrl = await saveFile(mediaFile, 'story-media');
        }

        const story = new Story(data);
        await story.save();
        return { status: 201, body: { success: true, message: 'Story created successfully', data: story } };
    } catch (err) {
        console.error('createStory error:', err);
        return { status: 400, body: { success: false, message: err.message } };
    }
};

export const getStories = async (query = {}) => {
    try {
        const { status } = query;
        const filter = { deletedAt: null };
        if (status) filter.status = status;

        const docs = await Story.find(filter).sort({ createdAt: -1 });

        return {
            status: 200,
            body: {
                success: true,
                data: docs
            }
        };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};

export const updateStory = async (id, request) => {
    try {
        const form = await request.formData();
        const data = {};

        const fields = ['title', 'mediaType', 'status'];
        fields.forEach(field => {
            const val = form.get(field);
            if (val !== null) data[field] = val;
        });

        const mediaFile = form.get('media');
        if (mediaFile && mediaFile instanceof File && mediaFile.size > 0) {
            if (data.mediaType === 'image') {
                validateImageFile(mediaFile);
            }
            data.mediaUrl = await saveFile(mediaFile, 'story-media');
        }

        const story = await Story.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );
        if (!story) return { status: 404, body: { success: false, message: 'Story not found' } };
        return { status: 200, body: { success: true, message: 'Story updated successfully', data: story } };
    } catch (err) {
        console.error('updateStory error:', err);
        return { status: 400, body: { success: false, message: err.message } };
    }
};

export const deleteStory = async (id) => {
    try {
        const story = await Story.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
        if (!story) return { status: 404, body: { success: false, message: 'Story not found' } };
        return { status: 200, body: { success: true, message: 'Story deleted successfully' } };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};
