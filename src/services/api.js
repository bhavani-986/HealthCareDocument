import axios from 'axios';

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post('/api/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getDocuments = () => axios.get('/api/documents');
export const deleteDocument = (id) => axios.delete(`/api/documents/${id}`);

export const sendMessage = (message) => axios.post('/api/chat/message', { message });
export const getChatHistory = () => axios.get('/api/chat/history');
