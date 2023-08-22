import { postData, axiosPostData } from "../../utils/fetch-services";

export const getAllCasinoGame = async (request) => {
  const result = await postData("casinoGame/getAllCasinoGame", request);
  return result.success ? result.data : [];
};

export const deleteCasinoGame = async (id) => {
  const result = await postData("casinoGame/deleteCasinoGame", {
    _id: id,
  });
  return result.success;
};

export const getCasinoGameDetailByID = async (id) => {
  if (!id) {
    return null;
  }
  const result = await postData("casinoGame/getCasinoGameById", {
    _id: id,
  });
  return result.success ? result.data.details : [];
};

export const addCasinoGame = async (request) => {
  try {
    const result = await axiosPostData("casinoGame/createCasinoGame", request);
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const updateCasinoGame = async (request) => {
  const result = await axiosPostData("casinoGame/updateCasinoGame", request);
  return result;
};

export const changeStatus = async (request) => {
  const result = await postData("casinoGame/updateCasinoGameStatus", request);
  return result;
};
