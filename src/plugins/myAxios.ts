import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8101/api",
  timeout: 1000,
  headers: {},
});

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    // 剔除多余字段，只返回需要的数据
    const data = response.data;
    if (data.code == 0) {
      console.log(data.data);
      return data.data;
    }
    console.log("error");
    return response;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
export default instance;
