import { postData, axiosPostData } from "../../utils/fetch-services";

export const getAllCasino = async (request) => {
  const result = await postData("casino/getAllCasino", request);
  return result.success ? result.data : [];
};

export const getAllCasinoOptions = async (request) => {
  const result = await postData("casino/getAllCasinoList", request);
  return result.success ? result.data : [];
};

export const deleteCasino = async (id) => {
  const result = await postData("casino/deleteCasino", {
    _id: id,
  });
  return result.success;
};

export const getCasinoDetailByID = async (id) => {
  if (!id) {
    return null;
  }
  const result = await postData("casino/getCasinoById", {
    _id: id,
  });
  return result.success ? result.data.details : [];
};

export const addCasino = async (request) => {
  try {
    const result = await axiosPostData("casino/createCasino", request);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateCasino = async (request) => {
  const result = await axiosPostData("casino/updateCasino", request);
  return result;
};

export const changeStatus = async (request) => {
  const result = await postData("casino/updateCasinoStatus", request);
  return result;
};
