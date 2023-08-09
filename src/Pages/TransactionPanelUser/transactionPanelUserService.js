import CryptoJS from "crypto-js";
import { postData } from "../../utils/fetch-services";

export const user = JSON.parse(localStorage.getItem("user_info"));

export const getAllTransactionUsers = async (request) => {
  const result = await postData("transactionUser/getAllTransactionUsers", request);
  return result.success ? result.data : [];
};

export const deleteTransactionUser = async (id) => {
  const result = await postData("transactionUser/deleteTransactionUser", {
    _id: id,
  });
  return result.success;
};

export const getTransactionUserById = async (id) => {
  if (!id) {
    return null;
  }
  const result = await postData("transactionUser/getTransactionUserById", {
    _id: id,
  });
  return result.success ? result.data.details : {};
};

export const createTransactionUser = async (request) => {
  const result = await postData("transactionUser/createTransactionUser", request);
  return result;
};

export const updateTransactionUser = async (request) => {
  const result = await postData("transactionUser/updateTransactionUser", request);
  return result;
};
