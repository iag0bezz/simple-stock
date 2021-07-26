import axios from 'axios';

const baseUrl = 'http://localhost:4000';

const api = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
  headers: {
    'Authorization': localStorage.getItem('@Authentication accessToken') ? `Bearer ${localStorage.getItem('@Authentication accessToken')}` : null,
    'Content-Type': 'application/json',
    'accept': 'application/json',
  },
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const request = error.config;
    let refreshToken = localStorage.getItem('@Authentication refreshToken')

    if (
      refreshToken &&
      error.response.status === 401 &&
      !request._retry
    ) {
      request._retry = true;

      return api
        .post('/auth/refresh', { refreshToken })
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem('@Authentication accessToken', response.data.refreshToken);
            
            return axios(request);
          }
        });
    }
    return Promise.reject(error);
  }
)

export default api;