import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiServerURL } from "./config";
import LocalStorage from "./local-storage";
import { APP_LOCAL_STORAGE_KEY } from "@/consts";
import { isTokenExpired } from "./jwt";

const headers: AxiosRequestConfig["headers"] = {
  "Content-Type": "application/json",
};

class Axios {
  private instance: AxiosInstance;
  private interceptor: number | null = null;

  constructor() {
    const instance = axios.create({ baseURL: ApiServerURL, headers });

    // Config request interceptor
    instance.interceptors.request.use(
      (config: any) => {
        const accessToken = LocalStorage.get(
          APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN,
        );

        if (config.headers) {
          if (accessToken) {
            // Only check token expiration and remove if it's significantly expired (5 minute buffer)
            if (isTokenExpired(accessToken)) {
              console.warn("Token is expired, removing from storage");
              LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
              delete config.headers.Authorization;
            } else {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
          } else {
            delete config.headers.Authorization;
          }
        }

        return config;
      },
      (error) => Promise.reject(error),
    );
    // Config response interceptor
    const interceptor = instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      (error: AxiosError) => {
        // Only remove token on specific 401 scenarios, not all 401s
        if (error.response?.status === 401) {
          const errorData = error.response?.data as any;
          const errorMessage = errorData?.message || "";
          const errorCode = errorData?.code || "";

          // Only remove token if it's actually an authentication failure
          // Don't remove on authorization failures (user doesn't have permission)
          if (
            errorMessage.toLowerCase().includes("token") ||
            errorMessage.toLowerCase().includes("unauthorized") ||
            errorMessage.toLowerCase().includes("expired") ||
            errorCode === "TOKEN_EXPIRED" ||
            errorCode === "INVALID_TOKEN"
          ) {
            console.warn(
              "Authentication failed, removing token:",
              errorMessage,
            );
            LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
          } else {
            console.warn(
              "Authorization failed but keeping token:",
              errorMessage,
            );
          }
        }

        return Promise.reject(error);
      },
    );

    this.interceptor = interceptor;
    this.instance = instance;
  }
  public get Instance(): AxiosInstance {
    return this.instance;
  }

  private useInterceptor() {
    if (this.interceptor === null) {
      const interceptor = this.instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error: AxiosError) => Promise.reject(error),
      );
      this.interceptor = interceptor;
    }
  }

  public get<Type = any, Resposnse = Type>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Resposnse> {
    this.useInterceptor();
    return this.Instance.get<Type, Resposnse>(url, config);
  }

  public post<Type = any, Resposnse = Type>(
    url: string,
    data?: Type,
    config?: AxiosRequestConfig,
  ): Promise<Resposnse> {
    this.useInterceptor();
    return this.Instance.post<Type, Resposnse>(url, data, config);
  }

  public put<Type = any, Resposnse = Type>(
    url: string,
    data?: Type,
    config?: AxiosRequestConfig,
  ): Promise<Resposnse> {
    this.useInterceptor();
    return this.Instance.put<Type, Resposnse>(url, data, config);
  }

  public delete<Type = any, Resposnse = Type>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Resposnse> {
    this.useInterceptor();
    return this.Instance.delete<Type, Resposnse>(url, config);
  }
}

const HttpClient = new Axios();
export default HttpClient;
