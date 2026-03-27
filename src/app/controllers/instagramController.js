import * as instagramService from '../services/instagramService.js';

// Reels Controllers
export const getReels = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const filters = {};
        if (searchParams.get('status')) filters.status = searchParams.get('status');

        const reels = await instagramService.getReels(filters);
        return { status: 200, body: { success: true, data: reels } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const createReel = async (request) => {
    try {
        const data = await request.json();
        const reel = await instagramService.createReel(data);
        return { status: 201, body: { success: true, data: reel } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const updateReel = async (id, request) => {
    try {
        const data = await request.json();
        const reel = await instagramService.updateReel(id, data);
        if (!reel) return { status: 404, body: { success: false, message: 'Reel not found' } };
        return { status: 200, body: { success: true, data: reel } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const deleteReel = async (id) => {
    try {
        const result = await instagramService.deleteReel(id);
        if (!result) return { status: 404, body: { success: false, message: 'Reel not found' } };
        return { status: 200, body: { success: true, message: 'Reel deleted successfully' } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

// Header Controllers
export const getHeader = async () => {
    try {
        const header = await instagramService.getHeader();
        return { status: 200, body: { success: true, data: header } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const updateHeader = async (request) => {
    try {
        const data = await request.json();
        const header = await instagramService.updateHeader(data);
        return { status: 200, body: { success: true, data: header } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};
