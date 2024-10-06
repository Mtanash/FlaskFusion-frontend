import axiosInstance from "../axios/axiosInstance";

export const cropImage = async (
  id: string,
  top: number,
  left: number,
  right: number,
  bottom: number
) => {
  const response = await axiosInstance.post(`/images/${id}/crop`, {
    top,
    left,
    right,
    bottom,
  });

  return response.data;
};
