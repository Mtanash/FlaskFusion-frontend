import axiosInstance from "../axios/axiosInstance";

interface CategorizeResponse {
  categories: { label: string; score: number }[][];
}

export const categorizeText = async (
  text: string
): Promise<CategorizeResponse> => {
  const response = await axiosInstance.post("/text/categorize", { text });
  return response.data;
};
