import axios, { AxiosRequestConfig } from "axios";
// config
import { HOST_API } from "@/config";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
});

const signFn = () => {
  clearTimeout((window as any).signTimer);
  if (typeof (window as any).sign === "function") {
    (window as any).sign();
  } else {
    (window as any).signTimer = setTimeout(() => {
      signFn();
    }, 1000);
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("_AK_TOKEN_") || "{}").token;

    if (token) {
      config.headers.Authorization = token;
      // FIXME remove this
      // config.headers.Authorization = "0ac50669bce34b9fb7fbcc5d5fc00e73d341ba464760d8675e3baf6833465aaa4e1f5069bf036af3f68001cf4a26112341dbf991c72ebf552c4d137711cdf692";
    }

    return config;
  },
  (error) => {
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

// Add response interceptor to handle 401 errors and CORS issues
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("axios error:", error);

    // Check if error has response and status is 401
    if (error.status === 401) {
      console.log("401 Unauthorized detected, clearing token and signing out");
      // Clear token from localStorage
      localStorage.removeItem("_AK_TOKEN_");

      // Call sign out function if available
      signFn();
    }

    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};
