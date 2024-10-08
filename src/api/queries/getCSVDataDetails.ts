import axiosInstance from "../axios/axiosInstance";

interface GetCSVDataDetailsResponse {
  _id: string;
  filename: string;
  filepath: string;
  uploaded_at: string;
}

export const getCSVDataDetails = async (
  id: string
): Promise<GetCSVDataDetailsResponse> => {
  const response = await axiosInstance.get(`/csv/${id}`);
  return response.data;
};
