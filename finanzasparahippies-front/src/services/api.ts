import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || '/api')
  : (process.env.INTERNAL_API_URL || process.env.API_URL || 'http://backend:8000/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10s timeout anti-hangs
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-ID': 'fph',
  },
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

// Guard de Hydración SSR para LocalStorage y Tenant Context
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access') || localStorage.getItem('token');
      if (token && token !== 'null' && token !== 'undefined') {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      
      // Inyección dinámica del subdominio/tenant si aplica
      const host = window.location.host;
      if (host) {
        config.headers.set('X-Tenant-Host', host);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuestas Blindado (Anti Silent Rejections & Backoff Exponencial)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // Manejo de caídas de red o timeouts donde error.response es undefined
    if (!error.response) {
      console.error('[FPH API Error] Fallo de red o timeout alcanzado:', error.message);
      return Promise.reject(new Error('Fallo de conexión con el servidor. Intenta de nuevo.'));
    }

    const status = error.response.status;

    // Reintento exponencial automático para errores 5xx del servidor (Máximo 2 reintentos)
    if (status >= 500 && originalRequest) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 2) {
        const backoffMs = Math.pow(2, originalRequest._retryCount) * 500;
        console.warn(`[FPH API 5xx Error ${status}] Reintento ${originalRequest._retryCount}/2 en ${backoffMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        return api(originalRequest);
      }
    }

    // Refresh Token para errores 401 Unauthenticated
    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          try {
            const refreshRes = await axios.post(`${API_URL}/auth/jwt/refresh/`, {
              refresh: refreshToken,
            });
            if (refreshRes.status === 200 && refreshRes.data?.access) {
              const newAccess = refreshRes.data.access;
              localStorage.setItem('access', newAccess);
              originalRequest.headers.set('Authorization', `Bearer ${newAccess}`);
              return api(originalRequest);
            }
          } catch (refreshErr) {
            console.error('[FPH Auth] Error renovando sesión JWT:', refreshErr);
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.href = '/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
