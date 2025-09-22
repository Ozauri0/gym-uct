import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { IHttpClient } from '@/core/application/ports/IHttpClient';
import { environment } from '../config/environment';

export class ApiClient implements IHttpClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(private onSessionExpired?: () => void) {
    this.client = axios.create({
      baseURL: environment.API_BASE_URL,
      timeout: environment.API_TIMEOUT,
      withCredentials: true, // Para cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // El access token se maneja via cookies HttpOnly
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Si es 401 y no es un retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Esperar a que termine el refresh actual
            return new Promise((resolve) => {
              this.refreshSubscribers.push(() => {
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Intentar refresh
            const response = await this.client.post('/auth/refresh');
            
            this.isRefreshing = false;
            this.onRefreshSuccess();
            
            // Reintentar request original
            return this.client(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            this.refreshSubscribers = [];
            
            // Notificar sesión expirada
            if (this.onSessionExpired) {
              this.onSessionExpired();
            }
            
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private onRefreshSuccess(): void {
    this.refreshSubscribers.forEach((callback) => callback(''));
    this.refreshSubscribers = [];
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  setAuthToken(token: string): void {
    // No usado - tokens en cookies HttpOnly
  }

  clearAuthToken(): void {
    // No usado - tokens en cookies HttpOnly
  }
}
