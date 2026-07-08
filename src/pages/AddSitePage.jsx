import React from 'react';
import { useNavigate } from 'react-router-dom';
import SiteForm from '../components/SiteForm';
import { createSite } from '../api/sites';
import { useNotification } from '../context/NotificationContext';

export default function AddSitePage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const handleAdd = async (site) => {
    try {
      await createSite(site);
      showSuccess(`Site "${site.name}" added successfully.`);
      navigate('/sites');
    } catch (err) {
      console.error(err);
      showError('Error adding site');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Add Site</h2>
      <SiteForm onSubmit={handleAdd} />
    </div>
  );
}