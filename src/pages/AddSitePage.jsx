import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteForm from '../components/SiteForm';
import { createSite } from '../api/sites';

export default function AddSitePage() {
  const navigate = useNavigate();

  const handleAdd = async (site) => {
    try {
      await createSite(site);
      navigate('/sites');
    } catch (err) {
      console.error(err);
      alert('Failed to add site');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Site</h2>
      <SiteForm onSubmit={handleAdd} />
    </div>
  );
}