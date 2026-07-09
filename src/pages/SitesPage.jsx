import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSites } from '../api/sites';
import axios from 'axios';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

const API_URL = 'http://localhost:5000/sites';

export default function SitesPage() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
  setLoading(true);

  getSites()
    .then((data) => {
      setSites(data);
    })
    .catch((err) => {
      console.error("Error loading sites:", err);
      showError("Failed to load sites.");
    })
    .finally(() => {
      setLoading(false);
    });
}, []);

const handleDelete = async (site) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete site "${site.name}"?`
  );

  if (!confirmed) return;

  console.log('Deleting site object:', site);
  console.log('site.index =', site.index);
  console.log('API URL being called =', `${API_URL}/${site.index}`);

  try {
    const response = await axios.delete(`${API_URL}/${site.index}`);
    console.log('DELETE success:', response.data);
    showSuccess(`Deleted site "${site.name}" successfully.`);

    setSites((prev) => prev.filter((s) => s.index !== site.index));
  } catch (err) {
    console.log('FULL DELETE ERROR:', err);
    console.log('err.response?.status:', err.response?.status);
    console.log('err.response?.data:', err.response?.data);
    console.log('err.message:', err.message);
    showError('Error deleting site');
  }
};

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sites</h1>
      <Link to="/add-site">Add Site</Link>
      <table className="sites-table">
        <thead>
          <tr className="sites-table-header">
            <th>Index</th>
            <th>Name</th>
            <th>Type</th>
            <th>Frequency (MHz)</th>
            <th>Repeater RX (MHz)</th>
            <th>Repeater TX (MHz)</th>
            <th>PL Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                <LoadingSpinner text="Loading sites..." />
              </td>
            </tr>
          ) : sites.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-4">No sites found.</td>
            </tr>
          ) : (
            sites.map(site => (
              <tr key={site.index} className="sites-table-row">
                <td>{site.index}</td>
                <td>{site.name}</td>
                <td>{site.type}</td>
                <td>{site.frequency}</td>
                <td>{site.repeater_rx}</td>
                <td>{site.repeater_tx}</td>
                <td>{site.plcode}</td>
                <td>
                  <div className="actions">
                    <Link to={`/sites/edit/${site.index}`}
                    style={{ textDecoration: 'none', color: 'black', marginRight: '10px' }}>
                      ✎
                    </Link>

                    <span
                      onClick={() => handleDelete(site)}
                      className="delete-icon"
                      title="Delete Radio"
                    >
                      🗑
                    </span>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}