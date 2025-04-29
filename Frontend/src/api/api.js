import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL: import.meta.mode==="development" ? API_BASE_URL : '/api',
  withCredentials: true,
});