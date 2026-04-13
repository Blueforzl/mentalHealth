import service from '@/utils/request';
export const login = (data) => {
  return service.post('/user/login', data);
};

export const categoryTree = (data) => {
  return service.get('knowledge/category/tree', data);
};

export const articlePage = (params) => {
  return service.get('/knowledge/article/page', { params });
};
