import { postData } from "../../utils/fetch-services";

export const getAllData = async (page, perPage, sortBy, direction, searchQuery, parentId) => {
  const result = await postData("users/getAllUsers", {
    page: page,
    perPage: perPage,
    sortBy: sortBy,
    direction: direction,
    searchQuery: searchQuery,
    parentId: parentId,
  });
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
  return result.success ? result.data.details : [];
};

export const addData = async (request) => {
  const result = await postData("users/createUser", request);
  return result;
};

export const updateData = async (request) => {
  const result = await postData("users/updateUser", request);
  return result;
};

export const updateUserStatus = async (request) => {
  const result = await postData("users/updateUserStatus", request);
  return result;
};

export const getAppModuleListing = async (request) => {
  const result = await postData("users/getAppModuleListing", request);
  return result.success ? result.data : [];
};
