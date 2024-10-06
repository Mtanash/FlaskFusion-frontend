import axiosInstance from "../axios/axiosInstance";

export const deleteImage = async (id: string) => {
  const response = await axiosInstance.delete(`/images/${id}`);
  return response.data;
};
