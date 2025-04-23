import axios, { AxiosInstance } from 'axios';

export const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://brainly-wzoi.onrender.com', // Replace with your API's base URL
  timeout: 10000, // Optional: Set a request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


