import axios from 'axios';

const API_URL = 'http://localhost:5000/sites'; // Update if needed

export async function getSites() {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function getSiteByIndex(index) {
  const res = await axios.get(`${API_URL}/${index}`);
  return res.data;
}

export async function createSite(site) {
  const res = await axios.post(API_URL, site);
  return res.data;
}

export async function updateSite(index, site) {
  try {
    const res = await axios.put(`${API_URL}/${index}`, site);
    return res.data;
  } catch (err) {
    console.error('API updateSite error:', err.response?.data || err.message);
    throw err;
  }
}

export async function deleteSite(index) {
  const res = await axios.delete(`${API_URL}/${index}`);
  return res.data;
}