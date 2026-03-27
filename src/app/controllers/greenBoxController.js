import greenBoxService from '../services/greenBoxService.js';

export const getContent = async () => {
    try {
        const content = await greenBoxService.getGreenBoxContent();
        return { status: 200, body: { success: true, data: content } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const updateContent = async (request) => {
    try {
        const data = await request.json();
        const content = await greenBoxService.updateGreenBoxContent(data);
        return { status: 200, body: { success: true, data: content } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};
