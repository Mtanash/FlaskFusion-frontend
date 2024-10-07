import axiosInstance from "../axios/axiosInstance";

interface KeywordsResponse {
  keywords: string[];
}

export const keywordsText = async (text: string): Promise<KeywordsResponse> => {
  const response = await axiosInstance.post("/text/keywords", { text });
  return response.data;
};
