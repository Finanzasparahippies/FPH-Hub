import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar el refresh del token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Solo intentar refresh si hay una respuesta y es 401
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
            refresh: refreshToken
          });
          
          if (response.status === 200) {
            const newAccessToken = response.data.access;
            localStorage.setItem('access', newAccessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("Session expired, logging out...");
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
