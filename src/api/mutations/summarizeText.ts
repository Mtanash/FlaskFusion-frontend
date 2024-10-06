import axiosInstance from "../axios/axiosInstance";

export const summarizeText = async (text: string) => {
  const response = await axiosInstance.post("/text/summarize", { text });
  return response.data;
};
