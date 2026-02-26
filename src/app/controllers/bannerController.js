import Banner from '../models/banner.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';

export const createBanner = async (request) => {
    try {
        const form = await request.formData();
        const data = {
            title: form.get('title'),
            subtitle: form.get('subtitle'),
            label: form.get('label'),
            buttonPrimaryText: form.get('buttonPrimaryText'),
            buttonPrimaryLink: form.get('buttonPrimaryLink'),
            buttonSecondaryText: form.get('buttonSecondaryText'),
            buttonSecondaryLink: form.get('buttonSecondaryLink'),
            status: form.get('status') || 'active',
            order: Number(form.get('order')) || 0,
            mobileButton1Text: form.get('mobileButton1Text'),
            mobileButton1Link: form.get('mobileButton1Link'),
            mobileButton2Text: form.get('mobileButton2Text'),
            mobileButton2Link: form.get('mobileButton2Link'),
        };

        const imageFile = form.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            validateImageFile(imageFile);
            data.image = await saveFile(imageFile, 'banner-images');
        }

        const rightImageFile = form.get('rightImage');
        if (rightImageFile && rightImageFile instanceof File && rightImageFile.size > 0) {
            validateImageFile(rightImageFile);
            data.rightImage = await saveFile(rightImageFile, 'banner-images');
        }

        const banner = new Banner(data);
        await banner.save();
        return { status: 201, body: { success: true, message: 'Banner created successfully', data: banner } };
    } catch (err) {
        console.error('createBanner error:', err);
        return { status: 400, body: { success: false, message: err.message } };
    }
};

export const getBanners = async (query = {}) => {
    try {
        const { status, limit = 10, page = 1 } = query;
        const filter = { deletedAt: null };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;
        const docs = await Banner.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Banner.countDocuments(filter);

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

export const getBannerById = async (id) => {
    try {
        const banner = await Banner.findOne({ _id: id, deletedAt: null });
        if (!banner) return { status: 404, body: { success: false, message: 'Banner not found' } };
        return { status: 200, body: { success: true, data: banner } };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};

export const updateBanner = async (id, request) => {
    try {
        const form = await request.formData();
        const data = {};

        const fields = [
            'title', 'subtitle', 'label',
            'buttonPrimaryText', 'buttonPrimaryLink',
            'buttonSecondaryText', 'buttonSecondaryLink',
            'status'
        ];

        fields.forEach(field => {
            const val = form.get(field);
            if (val !== null) data[field] = val;
        });

        if (form.get('order') !== null) data.order = Number(form.get('order'));

        const imageFile = form.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            validateImageFile(imageFile);
            data.image = await saveFile(imageFile, 'banner-images');
        }

        const rightImageFile = form.get('rightImage');
        if (rightImageFile && rightImageFile instanceof File && rightImageFile.size > 0) {
            validateImageFile(rightImageFile);
            data.rightImage = await saveFile(rightImageFile, 'banner-images');
        }

        const banner = await Banner.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );
        if (!banner) return { status: 404, body: { success: false, message: 'Banner not found' } };
        return { status: 200, body: { success: true, message: 'Banner updated successfully', data: banner } };
    } catch (err) {
        console.error('updateBanner error:', err);
        return { status: 400, body: { success: false, message: err.message } };
    }
};

export const deleteBanner = async (id) => {
    try {
        const banner = await Banner.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );
        if (!banner) return { status: 404, body: { success: false, message: 'Banner not found' } };
        return { status: 200, body: { success: true, message: 'Banner deleted successfully' } };
    } catch (err) {
        return { status: 500, body: { success: false, message: err.message } };
    }
};
