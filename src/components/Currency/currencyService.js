import { postData } from '../../utils/fetch-services';

export const getAllData = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('currencies/getAllCurrency', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteData = async (id) => {
    const result = await postData('currencies/deleteCurrency', {
        _id: id,
    });
    return result.success;
};

export const getDetailByID = async (id) => {
    const result = await postData('currencies/getCurrencyById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addData = async (request) => {
    const result = await postData('currencies/createCurrency', request);
    return result.success ? result.data.details : [];
};

export const updateData = async (request) => {
    const result = await postData('currencies/updateCurrency', request);
    return result.success ? result.data.details : [];
};
