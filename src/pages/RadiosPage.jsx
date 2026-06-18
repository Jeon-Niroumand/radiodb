import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/radios';

export default function RadiosPage() {
  const [radios, setRadios] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setRadios(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (radio) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete serial # ${radio.serial}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${radio.id}`);

      // Remove from UI without refresh
      setRadios(prev => prev.filter(r => r.id !== radio.id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete radio');
    }
  };

const groupedRadios = radios.reduce((acc, radio) => {
  const site = radio.site_name || 'Unknown Site';
  const model = radio.model || 'Unknown Model';

  if (!acc[site]) {
    acc[site] = {};
  }

  if (!acc[site][model]) {
    acc[site][model] = [];
  }

  acc[site][model].push(radio);

  return acc;
}, {});

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Radios</h1>
      <Link
        to="/add"
        className="bg-blue-600 text-white px-3 py-1 rounded"
      >
        Add Radio
      </Link>

      <table className="w-full mt-4 border">
        <thead>
          <tr>
            <th>Model</th>
            <th>Serial</th>
            <th>Site Name</th>
            <th>Site Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* RADIOS */}
          {radios.map(r => (
            <tr key={r.id}>
              <td>{r.model}</td> {/* empty since model is now a header */}
              <td>{r.serial}</td>
              <td>{r.site_name}</td>
              <td>{r.site_type}</td>
              <td>
                <div className="actions">
                  <Link to={`/edit/${r.id}`}>✎</Link>
                  <span onClick={() => handleDelete(r)}>🗑</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}