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
            // Check if token is expired before adding it to headers
            if (isTokenExpired(accessToken)) {
              LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
              delete config.headers.Authorization;
              // Optionally redirect to login here if needed
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
        // Handle 401 Unauthorized errors
        if (error.response?.status === 401) {
          LocalStorage.remove(APP_LOCAL_STORAGE_KEY.ACCESS_TOKEN);
          // Optionally redirect to login here if needed
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
