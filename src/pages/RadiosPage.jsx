import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';
const API_URL = `${process.env.REACT_APP_API_URL}/radios`;

export default function RadiosPage({ searchTerm }) {
  const [radios, setRadios] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState('');  
  const [loading, setLoading] = useState(true);

  const { showSuccess, showError } = useNotification();

  const [limit, setLimit] = useState(50); // Number of radios per page
  const startRecord =
         totalRecords === 0 ? 0 : (page - 1) * limit + 1;

  const endRecord =
    Math.min(page * limit, totalRecords);

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
    .get(`${API_URL}?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearch)}`)
    .then(res => {
      setRadios(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords || 0);
    })
    .catch(err => {
      console.error('Error loading radios:', err);
      setRadios([]);
    })
    .finally(() => {
      setLoading(false);
    });
}, [page, limit, debouncedSearch]);

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
      <main style={{ padding: '16px' }}>
        <h1>Radios</h1>
        <Link to="/add">Add Radio</Link>
        <table className="radios-table">
          <thead>
            <tr className="data-table-header">
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
                <td colSpan={9}>
                  <LoadingSpinner text="Loading radios..." />
                </td>
              </tr>
            ) : radios.length === 0 ? (
              <tr>
                <td colSpan="9">No radios found.</td>
              </tr>
            ) : (
              radios.map((r) => (
                <tr key={r.id} className="data-table-row">
                  <td>{r.model}</td>
                  <td>{r.serial}</td>
                  <td>{r.site_name}</td>
                  <td>{r.site_type}</td>
                  <td>{r.site_frequency}</td>
                  <td>{r.site_repeater_rx}</td>
                  <td>{r.site_repeater_tx}</td>
                  <td>{r.site_plcode}</td>
                  <td className="actions">
                    <Link to={`/edit/${r.id}`}>
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
        <div className = "pagination-container">
          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            {"<<"}
          </button>

          <button
            className="pagination-button"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            {"<"}
          </button>

          <div className="pagination-info">
              <div>
                  Page {page} of {totalPages}
              </div>

              <small>
                  Showing {startRecord}-{endRecord} of {totalRecords} radios
              </small>
          </div>

          <button
            className="pagination-button"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            {">"}
          </button>

          <button
            className="pagination-button"
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            {">>"}
          </button>

          <label className="rows-selector">
              Rows:
              <select
                  value={limit}
                  onChange={(e) => {
                      setLimit(Number(e.target.value));
                      setPage(1);
                  }}
              >
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
              </select>
          </label>
        </div>
      </main>
    </div>
  );
}