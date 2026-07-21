import api from './axios';

const API_URL = '/radios'; // Update if needed

export async function getRadios() {
  const response = await api.get(API_URL);
  return response.data;
}

export async function getRadioById(id) {
  const response = await api.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createRadio(radio) {
  const response = await api.post(API_URL, radio);
  return response.data;
}

export async function updateRadio(id, radio) {
  const response = await api.put(`${API_URL}/${id}`, radio);
  return response.data;
}

export async function deleteRadio(id) {
  const response = await api.delete(`${API_URL}/${id}`);
  return response.data;
}