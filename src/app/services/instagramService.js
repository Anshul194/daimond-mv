import InstagramReel from '../models/InstagramReel.js';
import InstagramHeader from '../models/InstagramHeader.js';

export const getReels = async (filters = {}) => {
    return await InstagramReel.find(filters).sort({ order: 1 });
};

export const createReel = async (data) => {
    return await InstagramReel.create(data);
};

export const updateReel = async (id, data) => {
    return await InstagramReel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteReel = async (id) => {
    return await InstagramReel.findByIdAndDelete(id);
};

export const getHeader = async () => {
    let header = await InstagramHeader.findOne();
    if (!header) {
        header = await InstagramHeader.create({});
    }
    return header;
};

export const updateHeader = async (data) => {
    let header = await InstagramHeader.findOne();
    if (header) {
        return await InstagramHeader.findByIdAndUpdate(header._id, data, { new: true });
    } else {
        return await InstagramHeader.create(data);
    }
};
