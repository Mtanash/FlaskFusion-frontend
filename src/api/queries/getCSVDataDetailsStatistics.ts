import axiosInstance from "../axios/axiosInstance";

interface GetCSVDataDetailsStatisticsResponse {
  mean: Record<string, number>;
  median: Record<string, number>;
  mode: Record<string, number>;
  outliers: Record<string, Record<string, number>>;
  quartiles: Record<string, Record<string, number>>;
}

export const getCSVDataDetailsStatistics = async (
  id: string
): Promise<GetCSVDataDetailsStatisticsResponse> => {
  const response = await axiosInstance.get(`/csv/${id}/statistics`);
  return response.data;
};
