import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("401 Error for URL:", error.config.url);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRoles");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;