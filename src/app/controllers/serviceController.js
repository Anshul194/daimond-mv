import Service from '../models/service.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';

export const createService = async (request) => {
    try {
        const form = await request.formData();
        const data = {
            title: form.get('title'),
            alt: form.get('alt'),
            link: form.get('link'),
            status: form.get('status') || 'active',
            order: Number(form.get('order')) || 0,
        };

        const imageFile = form.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            validateImageFile(imageFile);
            data.image = await saveFile(imageFile, 'service-images');
        } else {
            return { status: 400, body: { success: false, message: 'Image is required' } };
        }

        const service = new Service(data);
        await service.save();
        return { status: 201, body: { success: true, message: 'Service created successfully', data: service } };
    } catch (err) {
        console.error('createService error:', err);
        return { status: 400, body: { success: false, message: err.message } };
    }
};

export const getServices = async (query = {}) => {
    try {
        const { status, limit = 10, page = 1 } = query;
        const filter = { deletedAt: null };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;
        const docs = await Service.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Service.countDocuments(filter);

        return {
            status: 200,
            body: {
                success: true,
                data: {
                    docs,
                    total,
                    page: Number(page),
                    totalPages: Math.ceil(total / limit)
                }
            }
        };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};

export const getServiceById = async (id) => {
    try {
        const service = await Service.findOne({ _id: id, deletedAt: null });
        if (!service) return { status: 404, body: { success: false, message: 'Service not found' } };
        return { status: 200, body: { success: true, data: service } };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};

export const updateService = async (id, request) => {
    try {
        const form = await request.formData();
        const data = {};

        const fields = ['title', 'alt', 'link', 'status'];
        fields.forEach(field => {
            const val = form.get(field);
            if (val !== null) data[field] = val;
        });

        if (form.get('order') !== null) data.order = Number(form.get('order'));

        const imageFile = form.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            validateImageFile(imageFile);
            data.image = await saveFile(imageFile, 'service-images');
        }

        const service = await Service.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );
        if (!service) return { status: 404, body: { success: false, message: 'Service not found' } };
        return { status: 200, body: { success: true, message: 'Service updated successfully', data: service } };
    } catch (err) {
        console.error('updateService error:', err);
        return { status: 400, body: { success: false, message: err.message } };
    }
};

export const deleteService = async (id) => {
    try {
        const service = await Service.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
        if (!service) return { status: 404, body: { success: false, message: 'Service not found' } };
        return { status: 200, body: { success: true, message: 'Service deleted successfully' } };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};
