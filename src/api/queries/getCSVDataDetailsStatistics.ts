import axiosInstance from "../axios/axiosInstance";

export const getCSVDataDetailsStatistics = async (id: string) => {
  const response = await axiosInstance.get(`/csv/${id}/statistics`);
  return response.data;
};
