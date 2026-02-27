import CollectionRepository from '../repository/collectionRepository.js';

const collectionRepository = new CollectionRepository();

export const createCollection = async (data) => {
    return await collectionRepository.create(data);
};

export const getAllCollections = async (filter = {}, sort = { order: 1, createdAt: -1 }, page = 1, limit = 10) => {
    return await collectionRepository.getAll(filter, sort, page, limit);
};

export const getCollectionById = async (id) => {
    return await collectionRepository.get(id);
};

export const updateCollection = async (id, data) => {
    return await collectionRepository.update(id, data);
};

export const deleteCollection = async (id) => {
    return await collectionRepository.destroy(id);
};
