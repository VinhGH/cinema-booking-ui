import axios from 'axios';
import { supabase } from './supabase';

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Automatically attach JWT token
axiosInstance.interceptors.request.use(
    async (config) => {
        try {
            // Get current session from Supabase
            const { data: { session } } = await supabase.auth.getSession();

            // If session exists, attach token to Authorization header
            if (session?.access_token) {
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        } catch (error) {
            console.error('Error getting session:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle responses and errors
axiosInstance.interceptors.response.use(
    (response) => {
        // Backend wraps data in { success, data, message }
        // Extract the actual data for easier use
        return response.data;
    },
    (error) => {
        // Handle different types of errors
        if (error.response) {
            // Server responded with error status (4xx, 5xx)
            const message = error.response.data?.message || 'An error occurred';
            const status = error.response.status;

            // Special handling for 401 Unauthorized
            if (status === 401) {
                console.error('Authentication error. Please login again.');
                // Could trigger logout here if needed
            }

            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Request was made but no response received
            return Promise.reject(new Error('No response from server. Please check your connection.'));
        } else {
            // Something else happened during request setup
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;
