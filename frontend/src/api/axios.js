import axios from "axios";

const axiosInstance = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 50000,
    headers: { "Content-Type": "application/json" },
});

export default axiosInstance;