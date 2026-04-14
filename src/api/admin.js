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
export const articleCreate = (data) => {
  return service.post('/knowledge/article', data);
};
export const articleDetail=(id)=>{
  return service.get(`/knowledge/article/${id}`);
}
export const uploadFile = (file, businessInfo) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('businessType', 'ARTICLE');
  formData.append('businessId', businessInfo.id);
  formData.append('businessField', 'cover');

  return service.post('/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
