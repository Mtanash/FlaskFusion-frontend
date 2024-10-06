import axiosInstance from "../axios/axiosInstance";

export const getCSVDataDetailsTable = async (
  id: string,
  page: number = 1,
  page_size: number = 10
) => {
  const response = await axiosInstance.get(
    `/csv/${id}/data?page=${page}&page_size=${page_size}`
  );
  return response.data;
};
