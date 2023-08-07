import { postData } from '../../utils/fetch-services';

export const getAllTransactionActivity = async (request) => {
    const result = await postData('transactionActivity/getAllTransactionActivity', request);
    return result.success ? result.data : [];
};

export const deleteCurrency = async (id) => {
    const result = await postData('currencies/deleteCurrency', {
        _id: id,
    });
    return result;
};

export const getCurrencyDetailByID = async (id) => {
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
