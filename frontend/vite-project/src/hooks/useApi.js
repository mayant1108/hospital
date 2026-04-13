import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
export const useApi = () => api;

export const useGet = (url, options = {}) => {
  return useQuery({
    queryKey: ['get', url],
    queryFn: () => api.get(url).then(res => res.data),
    ...options,
  });
};

export const usePost = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const usePut = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.put(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useDelete = (url) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api.delete(url),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

