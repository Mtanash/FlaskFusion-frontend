import axiosInstance from "../axios/axiosInstance";

export const categorizeText = async (text: string) => {
  const response = await axiosInstance.post("/text/categorize", { text });
  return response.data;
};
