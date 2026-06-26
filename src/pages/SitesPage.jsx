import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSites } from '../api/sites';
import axios from 'axios';

const API_URL = 'http://localhost:5000/sites';

export default function SitesPage() {
  const [sites, setSites] = useState([]);

  useEffect(() => {
    getSites().then(setSites).catch(console.error);
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

    setSites((prev) => prev.filter((s) => s.index !== site.index));
  } catch (err) {
    console.log('FULL DELETE ERROR:', err);
    console.log('err.response?.status:', err.response?.status);
    console.log('err.response?.data:', err.response?.data);
    console.log('err.message:', err.message);

    alert(
      err.response?.data?.error ||
      err.response?.data ||
      err.message ||
      'Failed to delete site'
    );
  }
};

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sites</h1>
      <Link to="/add-site" className="bg-blue-600 text-white px-3 py-1 rounded">Add Site</Link>
      <table className="w-full mt-4 border">
        <thead>
          <tr>
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
          {sites.map(site => (
            <tr key={site.index} className="border-t">
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
          ))}
        </tbody>
      </table>
    </div>
  );
}