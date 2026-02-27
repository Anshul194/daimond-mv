import Collection from '../models/collection.js';
import { saveFile, validateImageFile } from '../lib/fileUpload.js';

export const createCollection = async (request) => {
    try {
        const form = await request.formData();
        const data = {
            name: form.get('name'),
            status: form.get('status') || 'active',
            order: Number(form.get('order')) || 0,
        };

        const imageFile = form.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            validateImageFile(imageFile);
            data.image = await saveFile(imageFile, 'collection-images');
        }

        const collection = new Collection(data);
        await collection.save();
        return { 
            status: 201, 
            success: true, 
            message: 'Collection created successfully', 
            data: collection 
        };
    } catch (error) {
        console.error('createCollection error:', error);
        return { 
            status: 400, 
            success: false, 
            message: error.message 
        };
    }
};

export const getAllCollections = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = Number(searchParams.get('page')) || 1;
        const limit = Number(searchParams.get('limit')) || 10;

        const filter = { deletedAt: null };
        if (status) filter.status = status;

        const skip = (page - 1) * limit;
        const docs = await Collection.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Collection.countDocuments(filter);

        return {
            status: 200,
            success: true,
            data: {
                result: docs,
                totalDocuments: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('getAllCollections error:', error);
        return { 
            status: 500, 
            success: false, 
            message: error.message 
        };
    }
};

export const updateCollection = async (req, { params }) => {
    try {
        const { id } = params;
        const form = await req.formData();
        const data = {};

        const fields = ['name', 'status'];
        fields.forEach(field => {
            const val = form.get(field);
            if (val !== null) data[field] = val;
        });

        if (form.get('order') !== null) data.order = Number(form.get('order'));

        const imageFile = form.get('image');
        if (imageFile && imageFile instanceof File && imageFile.size > 0) {
            validateImageFile(imageFile);
            data.image = await saveFile(imageFile, 'collection-images');
        }

        const collection = await Collection.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: data },
            { new: true }
        );

        if (!collection) {
            return { 
                status: 404, 
                success: false, 
                message: 'Collection not found' 
            };
        }

        return { 
            status: 200, 
            success: true, 
            message: 'Collection updated successfully', 
            data: collection 
        };
    } catch (error) {
        console.error('updateCollection error:', error);
        return { 
            status: 400, 
            success: false, 
            message: error.message 
        };
    }
};

export const deleteCollection = async (req, { params }) => {
    try {
        const { id } = params;
        const collection = await Collection.findOneAndUpdate(
            { _id: id, deletedAt: null },
            { $set: { deletedAt: new Date() } },
            { new: true }
        );

        if (!collection) {
            return { 
                status: 404, 
                success: false, 
                message: 'Collection not found' 
            };
        }

        return { 
            status: 200, 
            success: true, 
            message: 'Collection deleted successfully' 
        };
    } catch (error) {
        console.error('deleteCollection error:', error);
        return { 
            status: 500, 
            success: false, 
            message: error.message 
        };
    }
};
