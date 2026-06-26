import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RadioForm from '../components/RadioForm';
import { getRadioById, updateRadio } from '../api/radios';

export default function EditRadioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [radio, setRadio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRadio() {
      try {
        const data = await getRadioById(id);
        setRadio(data);
      } catch (error) {
        console.error('Failed to load radio', error);
        alert('Error loading radio');
      } finally {
        setLoading(false);
      }
    }

    loadRadio();
  }, [id]);

  const handleUpdate = async (updatedRadio) => {
    try {
      await updateRadio(id, updatedRadio);
      navigate('/');
    } catch (error) {
      console.error('Failed to update radio', error);
      alert('Error updating radio');
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