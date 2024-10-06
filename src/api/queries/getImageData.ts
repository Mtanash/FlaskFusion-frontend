import axiosInstance from "../axios/axiosInstance";
import { ImageData } from "./getImages";

interface GetImageDataResponse {
  data: ImageData;
}

export const getImageData = async (
  id: string
): Promise<GetImageDataResponse> => {
  const response = await axiosInstance.get(`/images/${id}`);
  return response.data;
};
