import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RadioForm from '../components/RadioForm';
import { getRadioById, updateRadio } from '../api/radios';
import { useNotification } from '../context/NotificationContext';

export default function EditRadioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [radio, setRadio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    async function loadRadio() {
      try {
        const data = await getRadioById(id);
        setRadio(data);
      } catch (err) {
        console.error(err);
        showError('Error loading radio');
      } finally {
        setLoading(false);
      }
    }

    loadRadio();
  }, [id]);

  const handleUpdate = async (updatedRadio) => {
    try {
      await updateRadio(id, updatedRadio);

      showSuccess(`Updated serial # ${updatedRadio.serial}`);

      navigate('/');
    } catch (err) {
      console.error(err);
      showError('Error updating radio');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!radio) return <div>Radio not found.</div>;

  return (
    <div className="p-6">
      <h2>Edit Radio</h2>
      <RadioForm onSubmit={handleUpdate} initialData={radio} />
    </div>
  );
}