import api from './axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

export const getUsers = async () => {
  const response = await api.get(API_URL);
  return response.data;
};

export const getUser= async (id) => {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
}

export const createUser = async (user) => {
  const response = await api.post(API_URL, user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`${API_URL}/${id}`, user);
  return response.data;
}