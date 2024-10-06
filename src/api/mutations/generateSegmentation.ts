import axiosInstance from "../axios/axiosInstance";

export const generateSegmentation = async (id: string) => {
  const response = await axiosInstance.post(`/images/${id}/segmentation`);
  return response.data;
};
