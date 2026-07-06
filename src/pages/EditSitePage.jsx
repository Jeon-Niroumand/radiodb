import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SiteForm from '../components/SiteForm';
import { getSiteByIndex, updateSite } from '../api/sites';

export default function EditSitePage() {
  const { index } = useParams();
  
  console.log('Route index:', index);

  const navigate = useNavigate();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSite() {
      try {
        const data = await getSiteByIndex(index);
        setSite(data);
      } catch (error) {
        console.error('Failed to load site', error);
        alert('Error loading site');
      } finally {
        setLoading(false);
      }
    }

    loadSite();
  }, [index]);

  const handleUpdate = async (updatedSite) => {
    // Block changing the index during edit
    if (Number(updatedSite.index) !== Number(index)) {
      alert('Index cannot be updated');
      return;
    }

    try {
      await updateSite(index, updatedSite);
      navigate('/sites');
    } catch (error) {
      console.error('Failed to update site', error);
      alert(error.response?.data?.error || 'Error updating site');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!site) return <div>Site not found.</div>;

  return (
    <div className="p-6">
      <h2>Edit Site</h2>
      <SiteForm onSubmit={handleUpdate} initialData={site} />
    </div>
  )
}
