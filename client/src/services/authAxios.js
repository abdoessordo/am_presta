import axios from "axios";
import { refreshRoute } from "utils/APIRoutes";
import authService from "./auth.service";

export const axiosAuth = axios.create();
axiosAuth.interceptors.request.use(
  function (config) {
    config.headers.authorization = `Bearer ${authService.getCurrentUser()}`;
    config.withCredentials = true;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosAuth.interceptors.response.use(
  async function (response) {
    return response;
  },
  async (error) => {
    console.log(error.response.status);
    try {
      if (error.response.status === 401 && error.config.reget == null) {
        console.log("looooooooooog");
        error.config.reget = true;
        const { data } = await axiosAuth.get(refreshRoute);
        if (data.accesstoken) {
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(data));
          error.config.headers = {
            ...error.config.headers,
            authorization: `Bearer ${data.accessToken}`,
          };
        }
        return axiosAuth(error.config);
      }
    } catch (err) {
      console.log("rrrr");
      console.log(err);
    }
    return Promise.reject(error);
  }
);
export default axiosAuth;
