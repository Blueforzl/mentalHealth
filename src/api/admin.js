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
export const articleDetail = (id) => {
  return service.get(`/knowledge/article/${id}`);
};
export const updateArticle = (id, data) => {
  return service.put(`/knowledge/article/${id}`, data);
};
export const articleStatus = (id, data) => {
  return service.put(`/knowledge/article/${id}/status`, data);
};
export const articleDelete = (id) => {
  return service.delete(`/knowledge/article/${id}`);
};
export const sessionPage = (params) => {
  return service.get('/psychological-chat/sessions', { params });
};
export const sessionDetail = (id) => {
  return service.get(`/psychological-chat/sessions/${id}/messages`);
};
export const getEmotionPage = (params) => {
  return service.get('/emotion-diary/admin/page', { params });
};
export const deleteEmotion = (id) => {
  return service.delete(`/emotion-diary/admin/${id}`);
};
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
