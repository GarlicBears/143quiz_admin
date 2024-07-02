import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from 'axios';
import Cookies from 'js-cookie';

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  timeout: 5000,
});

// accessToken을 보내지 않을 URL 목록
const excludeUrlEndings = ['/login'];

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
  async (error: AxiosError): Promise<AxiosError> => {
    // 에러코드 401이 발생하면 refresh token을 사용하여 accessToken을 갱신
    if (error.response?.status === 401) {
      try {
        // refresh token을 사용하여 accessToken 갱신
        const response = await axiosInstance.get('/user/reissue');
        const token = response.headers['authorization'];
        if (token) {
          const accessToken = token.split(' ')[1].replace(/%/g, '');
          Cookies.set('accessToken', accessToken, {
            expires: 1,
            secure: true,
            sameSite: 'Strict',
          });

          // 원래의 요청을 다시 시도
          if (error.config) {
            error.config.headers.set('Authorization', `Bearer ${accessToken}`);
            return axiosInstance.request(error.config);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // refresh token이 만료된 경우 로그인 페이지로 이동
        Cookies.remove('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
