import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router';

//创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
});
//请求拦截器
service.interceptors.request.use(
  (config) => {
    //在发送请求之前做些什么
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//响应拦截器
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, config } = response;
    if (String(data.code) === '200') {
      // 只在有消息时显示，或根据配置决定
      if (data.msg) {
        ElMessage.success(data.msg);
      }
      return data.data;
    } else if (String(data.code) === '-1') {
      // 登录过期，跳转到登录页
      if (!config.url.includes('/login')) {
        ElMessage.error('登录过期，请重新登录');
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        // 保存当前路径，登录后可返回
        router.push({
          name: 'login',
          query: { redirect: window.location.pathname },
        });
      }
      return Promise.reject('登录过期');
    } else {
      ElMessage.error(data.msg || '请求失败');
      return Promise.reject(data.msg || '请求失败');
    }
  },
  (error) => {
    // 对响应错误做点什么
    ElMessage.error(error.message || '网络错误');
    return Promise.reject(error);
  },
);
export default service;
