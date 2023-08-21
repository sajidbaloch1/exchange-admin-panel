import { postData } from '../../utils/fetch-services';

export const getAllTransactionActivity = async (request) => {
    const result = await postData('transactionActivity/getAllTransactionActivity', request);
    return result.success ? result.data : [];
};

export const getUserActivity = async (request) => {
    const result = await postData('users/getUserActivity', request);
    return result.success ? result.data : [];
};

export const getUserActivityTypes = async (request) => {
    const result = await postData('users/getUserActivityTypes', request);
    return result.success ? result.data : [];
};
