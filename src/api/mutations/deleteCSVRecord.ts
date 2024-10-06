import axiosInstance from "../axios/axiosInstance";

export const deleteCSVRecord = async (id: string) => {
  const response = await axiosInstance.delete(`/csv/delete/${id}`);
  return response.data;
};
