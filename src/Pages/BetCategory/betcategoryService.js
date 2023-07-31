import { postData } from '../../utils/fetch-services';

export const getAllBetCategory = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('betCategories/getAllBetCategory', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteBetCategory = async (id) => {
    const result = await postData('betCategories/deleteBetCategory', {
        _id: id,
    });
    return result.success;
};

export const getBetCategoryDetailByID = async (id) => {
    const result = await postData('betCategories/getBetCategoryById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addBetCategory = async (request) => {
    const result = await postData('betCategories/createBetCategory', request);
    return result.success ? result.data.details : [];
};

export const updateBetCategory = async (request) => {
    const result = await postData('betCategories/updateBetCategory', request);
    return result.success ? result.data.details : [];
};
