import { postData } from "../../utils/fetch-services";

export const getChildUserData = async (request) => {
  const result = await postData("bet/getChildUserData", request);
  return result.success ? result.data : [];
};

export const settlement = async (request) => {
  const result = await postData("bet/settlement", request);
  return result;
};
