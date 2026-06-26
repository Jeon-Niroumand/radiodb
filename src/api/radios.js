import axios from 'axios';

const API_URL = 'http://localhost:5000/radios'; // Update if needed

export async function getRadios() {
  const response = await axios.get(API_URL);
  return response.data;
}

export async function getRadioById(id) {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
}

export async function createRadio(radio) {
  const response = await axios.post(API_URL, radio);
  return response.data;
}

export async function updateRadio(id, radio) {
  const response = await axios.put(`${API_URL}/${id}`, radio);
  return response.data;
}

export async function deleteRadio(id) {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
}