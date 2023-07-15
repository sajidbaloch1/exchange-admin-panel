import { postData } from '../../utils/fetch-services';

export const getAllRule = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('rules/getAllRule', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteRule = async (id) => {
    const result = await postData('rules/deleteRule', {
        _id: id,
    });
    return result.success;
};

export const getRuleDetailByID = async (id) => {
    const result = await postData('rules/getRuleById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addRule = async (request) => {
    const result = await postData('rules/createRule', request);
    return result.success ? result.data.details : [];
};

export const updateRule = async (request) => {
    const result = await postData('rules/updateRule', request);
    return result.success ? result.data.details : [];
};
