import axiosInstance from "../axios/axiosInstance";

interface SentimentResponse {
  label: string;
  score: number;
}

export const sentimentText = async (
  text: string
): Promise<SentimentResponse> => {
  const response = await axiosInstance.post("/text/sentiment", { text });
  return response.data;
};
