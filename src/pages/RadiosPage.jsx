import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { useNotification } from '../context/NotificationContext';

const API_URL = `${process.env.REACT_APP_API_URL}/radios`;

export default function RadiosPage() {
  const [radios, setRadios] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');  
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError } = useNotification();

  const LIMIT = 50;

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchTerm);
    setPage(1); // Reset to first page on new search
  }, 300); // 300ms debounce

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

useEffect(() => {
  setLoading(true);

  axios
    .get(`${API_URL}?page=${page}&limit=${LIMIT}&search=${encodeURIComponent(debouncedSearch)}`)
    .then(res => {
      setRadios(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    })
    .catch(err => {
      console.error('Error loading radios:', err);
      setRadios([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [page, debouncedSearch]);

  const handleDelete = async (radio) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete serial # ${radio.serial}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/${radio.id}`);
      setRadios(prev => prev.filter(r => r.id !== radio.id));
      showSuccess(`Deleted serial # ${radio.serial}`);
    } catch (err) {
      console.error(err);
      showError('Failed to delete radio');
    }
  };

  

  return (
    <div>
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <main style={{ padding: '16px' }}>
        <h1>Radios</h1>
        <Link to="/add">Add Radio</Link>
        <table>
          <thead>
            <tr>
              <th>Model</th>
              <th>Serial</th>
              <th>Site Name</th>
              <th>Site Type</th>
              <th>Frequency</th>
              <th>Repeater RX</th>
              <th>Repeater TX</th>
              <th>PL Code</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9">Loading...</td>
              </tr>
            ) : radios.length === 0 ? (
              <tr>
                <td colSpan="9">No radios found.</td>
              </tr>
            ) : (
              radios.map((r) => (
                <tr key={r.id}>
                  <td>{r.model}</td>
                  <td>{r.serial}</td>
                  <td>{r.site_name}</td>
                  <td>{r.site_type}</td>
                  <td>{r.site_frequency}</td>
                  <td>{r.site_repeater_rx}</td>
                  <td>{r.site_repeater_tx}</td>
                  <td>{r.site_plcode}</td>
                  <td>
                    <Link
                      to={`/edit/${r.id}`}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      ✎
                    </Link>

                    <span
                      onClick={() => handleDelete(r)}
                      style={{ cursor: 'pointer' }}
                    >
                      🗑
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}