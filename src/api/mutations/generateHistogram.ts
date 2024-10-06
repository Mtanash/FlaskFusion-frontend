import axiosInstance from "../axios/axiosInstance";

export const generateHistogram = async (id: string) => {
  const response = await axiosInstance.post(`/images/${id}/histogram`);
  return response.data;
};
