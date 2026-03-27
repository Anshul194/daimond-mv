import GreenBoxContent from '../models/GreenBoxContent.js';

const getGreenBoxContent = async () => {
    return await GreenBoxContent.findOne({ status: 'active' }) || await GreenBoxContent.findOne().sort({ createdAt: -1 });
};

const updateGreenBoxContent = async (data) => {
    const existing = await getGreenBoxContent();
    if (existing) {
        return await GreenBoxContent.findByIdAndUpdate(existing._id, data, { new: true });
    }
    return await GreenBoxContent.create(data);
};

export default {
    getGreenBoxContent,
    updateGreenBoxContent
};
