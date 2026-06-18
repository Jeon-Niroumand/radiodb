import React, { useState } from 'react';
import RadioForm from '../components/RadioForm';
import { createRadio } from '../api/radios';

export default function AddRadioPage() {
  const [resetSerialTrigger, setResetSerialTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAdd = async (radio) => {
    try {
      await createRadio(radio);

      // Trigger serial reset
      setResetSerialTrigger(prev => prev + 1);

      // Optional success flash
      setSuccessMessage(`Saved serial ${radio.serial}`);
      setTimeout(() => setSuccessMessage(''), 1500);

    } catch (error) {
      console.error('Failed to create radio', error);
      alert('Error adding radio');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        Add Radio
      </h2>

      {successMessage && (
        <div style={{ marginBottom: '12px', color: 'green' }}>
          {successMessage}
        </div>
      )}

      <RadioForm 
        onSubmit={handleAdd}
        resetSerialTrigger={resetSerialTrigger}
      />
    </div>
  );
}