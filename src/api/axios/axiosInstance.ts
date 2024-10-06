import axios from "axios";

export const MAIN_URL = "http://localhost:5000";

// already holds the token cookie
const axiosInstance = axios.create({
  baseURL: MAIN_URL,
});

export default axiosInstance;
