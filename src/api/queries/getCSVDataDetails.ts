import axiosInstance from "../axios/axiosInstance";

export const getCSVDataDetails = async (id: string) => {
  const response = await axiosInstance.get(`/csv/${id}`);
  return response.data;
};
