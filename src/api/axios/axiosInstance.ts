import CONFIG from "@/config";
import axios from "axios";

// already holds the token cookie
const axiosInstance = axios.create({
  baseURL: CONFIG.BASE_URL,
});

export default axiosInstance;
