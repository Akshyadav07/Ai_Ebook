import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const booksAPI = {
  getBooks: () => api.get('/books'),
  createBook: (data) => api.post('/books', data),
  getBook: (id) => api.get(`/books/${id}`),
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  deleteBook: (id) => api.delete(`/books/${id}`),
  generateBook: (id) => api.post(`/books/${id}/generate`),
  duplicateBook: (id) => api.post(`/books/${id}/duplicate`),
};

export const chaptersAPI = {
  getChapters: (bookId) => api.get(`/books/${bookId}/chapters`),
  createChapter: (bookId, data) => api.post(`/books/${bookId}/chapters`, data),
  getChapter: (bookId, id) => api.get(`/books/${bookId}/chapters/${id}`),
  updateChapter: (bookId, id, data) => api.put(`/books/${bookId}/chapters/${id}`, data),
  deleteChapter: (bookId, id) => api.delete(`/books/${bookId}/chapters/${id}`),
  reorderChapters: (bookId, data) => api.post(`/books/${bookId}/chapters/reorder`, data),
  regenerateChapter: (bookId, id) => api.post(`/books/${bookId}/chapters/${id}/regenerate`),
};

export const aiAPI = {
  improve: (data) => api.post('/ai/improve', data),
  rewrite: (data) => api.post('/ai/rewrite', data),
  summarize: (data) => api.post('/ai/summarize', data),
  expand: (data) => api.post('/ai/expand', data),
  simplify: (data) => api.post('/ai/simplify', data),
  fixGrammar: (data) => api.post('/ai/fix-grammar', data),
  generateExamples: (data) => api.post('/ai/generate-examples', data),
  continueWriting: (data) => api.post('/ai/continue-writing', data),
};

export default api;
