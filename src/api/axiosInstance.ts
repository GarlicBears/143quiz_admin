import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
  AxiosRequestHeaders,
} from 'axios';
import Cookies from 'js-cookie';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRrefreshed(token: string) {
  refreshSubscribers.map(cb => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: 'https://garlicbears.com/api',
  timeout: 5000,
  withCredentials: true,
});

// accessToken을 보내지 않을 URL 목록
const excludeUrlEndings = ['/login', '/admin/reissue'];

// 모든 요청에 대해 accessToken을 헤더에 추가
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 쿠키에서 accessToken 읽어오기
    const accessToken = Cookies.get('accessToken'); // 쿠키에서 토큰 가져오기.
    const isExcludedUrl = excludeUrlEndings.some(ending =>
      config.url?.endsWith(ending),
    );

    if (accessToken && !isExcludedUrl) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      config.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axiosInstance.get('/admin/reissue');
          const newAccessToken = response.headers['authorization'];

          if (newAccessToken) {
            Cookies.set('accessToken', newAccessToken, {
              expires: 1,
              secure: true,
              sameSite: 'Strict',
            });

            isRefreshing = false;
            onRrefreshed(newAccessToken);

            (originalRequest.headers as AxiosRequestHeaders).Authorization =
              `Bearer ${newAccessToken}`;
            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          refreshSubscribers = [];
          Cookies.remove('accessToken');
          window.location.href = `${process.env.PUBLIC_URL}/login`;
          return Promise.reject(refreshError);
        }
      }

      const retryOriginalRequest = new Promise(resolve => {
        addRefreshSubscriber((token: string) => {
          (originalRequest.headers as AxiosRequestHeaders).Authorization =
            `Bearer ${token}`;
          resolve(axiosInstance(originalRequest));
        });
      });

      return retryOriginalRequest;
    } else if (error.response?.status === 403) {
      window.location.href = `${process.env.PUBLIC_URL}/login`;
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
