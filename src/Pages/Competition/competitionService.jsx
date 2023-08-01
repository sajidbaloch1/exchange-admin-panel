import { postData, getData } from '../../utils/fetch-services';

export const getAllCompetition = async (request) => {
    const result = await postData('competition/getAllCompetition', request);
    return result.success ? result.data : [];
};

export const deleteCompetition = async (id) => {
    const result = await postData('competition/deleteCompetition', {
        _id: id,
    });
    return result.success;
};

export const getCompetitionDetailByID = async (id) => {
    if (!id) {
        return null;
    }
    const result = await postData('competition/getCompetitionById', {
        _id: id,
    });
    return result.success ? result.data.details : [];
};

export const addCompetition = async (request) => {
    try {
        const result = await postData('competition/createCompetition', request);
        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const updateCompetition = async (request) => {
    const result = await postData('competition/updateCompetition', request);
    return result
};

export const changeStatus = async (request) => {

    const result = await postData('competition/updateCompetitionStatus', request);
    return result
};
