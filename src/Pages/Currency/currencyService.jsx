import { postData } from '../../utils/fetch-services';

export const getAllCurrency = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('currencies/getAllCurrency', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteCurrency = async (id) => {
    const result = await postData('currencies/deleteCurrency', {
        _id: id,
    });
    return result;
};

export const getCurrencyDetailByID = async (id) => {
    if (!id) {
        return null;
    }
    const result = await postData('currencies/getCurrencyById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addCurrency = async (request) => {
    const result = await postData('currencies/createCurrency', request);
    return result;
};

export const updateCurrency = async (request) => {
    const result = await postData('currencies/updateCurrency', request);
    return result;
};
