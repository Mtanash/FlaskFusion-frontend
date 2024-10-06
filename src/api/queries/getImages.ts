import axiosInstance from "../axios/axiosInstance";

interface GetImagesResponse {
  data: ImageData[];
  total: number;
}

export interface ImageData {
  _id: string;
  file_path: string;
  original_name: string;
  segmentation_mask: string;
  filename: string;
  uploaded_at: string;
  color_histogram: {
    R: number[];
    G: number[];
    B: number[];
  };
}

export const getImages = async (
  page: number = 1,
  page_size: number = 10
): Promise<GetImagesResponse> => {
  const response = await axiosInstance.get(
    `/images?page=${page}&page_size=${page_size}`
  );
  return response.data;
};
