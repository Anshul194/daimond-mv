import homeStatService from '../services/homeStatService';

export const getStats = async (query = {}) => {
    try {
        // Sanitize query: only allow known filters like 'status'
        const filter = {};
        if (query.status) filter.status = query.status;

        const stats = await homeStatService.getHomeStats(filter);
        return { status: 200, body: { success: true, data: stats } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const createStat = async (request) => {
    try {
        const data = await request.json();
        const stat = await homeStatService.createHomeStat(data);
        return { status: 201, body: { success: true, data: stat } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const updateStat = async (id, request) => {
    try {
        const data = await request.json();
        console.log(`[Debug] Updating Stat ID: ${id}`, data);

        if (!id || id === 'undefined' || id === 'null') {
            return { status: 400, body: { success: false, message: `Invalid ID received: ${id}` } };
        }

        const stat = await homeStatService.updateHomeStat(id, data);
        console.log(`[Debug] Update result:`, stat ? "Found and updated" : "Not found");
        if (!stat) return { status: 404, body: { success: false, message: `Stat not found with ID: ${id}` } };
        return { status: 200, body: { success: true, data: stat } };
    } catch (error) {
        console.error(`[Debug] Update error:`, error);
        return { status: 500, body: { success: false, message: error.message } };
    }
};

export const deleteStat = async (id) => {
    try {
        await homeStatService.deleteHomeStat(id);
        return { status: 200, body: { success: true, message: 'Stat deleted' } };
    } catch (error) {
        return { status: 500, body: { success: false, message: error.message } };
    }
};
