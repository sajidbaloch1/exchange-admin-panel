import CryptoJS from "crypto-js";
import { postData } from "../../utils/fetch-services";

export const user = JSON.parse(localStorage.getItem("user_info"));

export const getAllThemeUsers = async (request) => {
  const result = await postData("themeUser/getAllThemeUsers", request);
  return result.success ? result.data : [];
};

export const deleteThemeUser = async (id) => {
  const result = await postData("themeUser/deleteThemeUser", {
    _id: id,
  });
  return result.success;
};

export const getThemeUserById = async (id) => {
  if (!id) {
    return null;
  }
  const result = await postData("themeUser/getThemeUserById", {
    _id: id,
  });
  return result.success ? result.data.details : {};
};

export const createThemeUser = async (request) => {
  const result = await postData("themeUser/createThemeUser", request);
  return result;
};

export const updateThemeUser = async (request) => {
  const result = await postData("themeUser/updateThemeUser", request);
  return result;
};
