import React, { useState } from 'react';
import RadioForm from '../components/RadioForm';
import { createRadio } from '../api/radios';

import { useNotification } from '../context/NotificationContext';

export default function AddRadioPage() {
  const [resetSerialTrigger, setResetSerialTrigger] = useState(0);
  const { showSuccess, showError } = useNotification();

  const handleAdd = async (radio) => {
    try {
      await createRadio(radio);

      // Trigger serial reset
      setResetSerialTrigger(prev => prev + 1);

      // Optional success flash
      showSuccess(`Added serial # ${radio.serial}`);

    } catch (err) {
      console.error(err);
      showError('Failed to add radio');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
        Add Radio
      </h2>

      <RadioForm 
        onSubmit={handleAdd}
        resetSerialTrigger={resetSerialTrigger}
      />
    </div>
  );
}