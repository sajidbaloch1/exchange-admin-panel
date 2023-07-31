import { postData, getData } from '../../utils/fetch-services';

export const getAllEvent = async (page, perPage, sortBy, direction, searchQuery) => {
    const result = await postData('event/getAllEvent', {
        page: page,
        perPage: perPage,
        sortBy: sortBy,
        direction: direction,
        searchQuery: searchQuery
    });
    return result.success ? result.data : [];
};

export const deleteEvent = async (id) => {
    const result = await postData('event/deleteEvent', {
        _id: id,
    });
    return result.success;
};

export const getEventDetailByID = async (id) => {
    const result = await postData('event/getEventById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addEvent = async (request) => {
    try {
        console.log(request);
        const result = await postData('event/createEvent', request);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const updateEvent = async (request) => {
    const result = await postData('event/updateEvent', request);
    return result
};

export const changeStatus = async (request) => {

    const result = await postData('event/updateEventStatus', request);
    return result
};
