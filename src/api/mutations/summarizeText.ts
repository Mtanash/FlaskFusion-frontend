import axiosInstance from "../axios/axiosInstance";

interface SummarizeResponse {
  summary: string;
}

export const summarizeText = async (
  text: string
): Promise<SummarizeResponse> => {
  const response = await axiosInstance.post("/text/summarize", { text });
  return response.data;
};
