import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", 
});

axiosInstance.interceptors.request.use(
    async (config) => {
        // Get the access token from localStorage
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor for response to check for expired access token and refresh it
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to an expired token , try refreshing the token
        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                const response = await axios.post(
                    "http://localhost:5000/auth/refresh",
                    { refreshToken }
                );
                const { accessToken } = response.data;

                // Store the new tokens in localStorage
                localStorage.setItem("accessToken", accessToken);

                // Retry the original request with the new access token
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return axios(originalRequest);
                
            } catch (refreshError) {
                console.error("Token refresh failed", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;


