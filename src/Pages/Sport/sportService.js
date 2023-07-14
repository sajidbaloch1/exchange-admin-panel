import { postData } from '../../utils/fetch-services';

export const getAllSport = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('sport/getAllSport', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteSport = async (id) => {
    const result = await postData('sport/deleteSport', {
        _id: id,
    });
    return result.success;
};

export const getSportDetailByID = async (id) => {
    const result = await postData('sport/getSportById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addSport = async (request) => {
    const result = await postData('sport/createSport', request);
    return result.success ? result.data.details : [];
};

export const updateSport = async (request) => {
    const result = await postData('sport/updateSport', request);
    return result.success ? result.data.details : [];
};
