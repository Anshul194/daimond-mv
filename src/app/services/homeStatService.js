import HomeStat from '../models/HomeStat.js';

const getHomeStats = async (query = {}) => {
    return await HomeStat.find(query).sort({ order: 1 });
};

const createHomeStat = async (data) => {
    return await HomeStat.create(data);
};

const updateHomeStat = async (id, data) => {
    return await HomeStat.findByIdAndUpdate(id, data, { new: true });
};

const deleteHomeStat = async (id) => {
    return await HomeStat.findByIdAndDelete(id);
};

export default {
    getHomeStats,
    createHomeStat,
    updateHomeStat,
    deleteHomeStat
};
