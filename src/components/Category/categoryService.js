import { postData } from '../../utils/fetch-services';

export const getAllData = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('categories/getAllCategory', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteData = async (id) => {
    const result = await postData('categories/deleteCategory', {
        _id: id,
    });
    return result.success;
};

export const getDetailByID = async (id) => {
    const result = await postData('categories/getCategoryById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addData = async (request) => {
    const result = await postData('categories/createCategory', request);
    return result.success ? result.data.details : [];
};

export const updateData = async (request) => {
    const result = await postData('categories/updateCategory', request);
    return result.success ? result.data.details : [];
};
