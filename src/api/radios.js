import axios from 'axios';

const API_URL = 'http://localhost:5000/radios'; // Update if different

export async function createRadio(radio) {
  return axios.post(API_URL, radio);
}