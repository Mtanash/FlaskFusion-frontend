import axiosInstance from "../axios/axiosInstance";

interface GetCSVDataResponse {
  data: csvData[];
  total: number;
}

export interface csvData {
  _id: string;
  filename: string;
  filepath: string;
  uploaded_at: string;
}

export const getCSVData = async (
  page: number = 1,
  page_size: number = 10
): Promise<GetCSVDataResponse> => {
  const response = await axiosInstance.get(
    `/csv?page=${page}&page_size=${page_size}`
  );
  return response.data;
};
