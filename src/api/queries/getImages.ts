import axiosInstance from "../axios/axiosInstance";

export const getImages = async (page: number = 1, page_size: number = 10) => {
  const response = await axiosInstance.get(
    `/images?page=${page}&page_size=${page_size}`
  );
  return response.data;
};
