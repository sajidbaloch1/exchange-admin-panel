import CryptoJS from "crypto-js";
import { postData } from "../../utils/fetch-services";

export const user = JSON.parse(localStorage.getItem("user_info"));

export const getAllData = async (request) => {
  const result = await postData("users/getAllUsers", request);
  return result.success ? result.data : [];
};

export const deleteData = async (id) => {
  const result = await postData("users/deleteUser", {
    _id: id,
  });
  return result.success;
};

export const getDetailByID = async (id) => {
  if (!id) {
    return null;
  }
  const result = await postData("users/getUserById", {
    _id: id,
  });
  return result.success ? result.data.details : {};
};

export const addData = async (request) => {
  const result = await postData("users/createUser", request);
  return result;
};

export const updateData = async (request) => {
  const result = await postData("users/updateUser", request);
  return result;
};

export const createCloneUser = async (request) => {
  const result = await postData("users/createUserClone", request);
  return result;
};

export const updateUserStatus = async (request) => {
  const result = await postData("users/updateUserStatus", request);
  return result;
};

export const getAppModuleListing = async (request) => {
  const result = await postData("users/getAppModulesList", request);
  return result.success ? result.data.details : [];
};

// Decrypt with CryptoJS AES
export const decryptUserPermissions = (encryptedPermissions) => {
  try {
    if (!encryptedPermissions) {
      return [];
    }
    const bytes = CryptoJS.AES.decrypt(encryptedPermissions, process.env.REACT_APP_PERMISSIONS_AES_SECRET);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

export const getPermissionsById = async (id) => {
  if (id) {
    const result = await postData("users/getUserPermissions", { _id: id });
    if (result.success) {
      return decryptUserPermissions(result.data.details);
    }
  }
  return [];
};
