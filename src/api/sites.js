import axios from 'axios';

const API_URL = 'http://localhost:5000/sites'; // Update if needed

export async function getSites() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function createSite(site) {
  return axios.post(API_URL, site);
}