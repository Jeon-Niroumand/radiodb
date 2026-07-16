import React from 'react';
import { useNavigate } from 'react-router-dom';

import UserForm from '../components/UserForm';
import { createUser } from '../api/users';
import { useNotification } from '../context/NotificationContext';

export default function AddUserPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (user) => {
    try {
      await createUser(user);

      showSuccess('User added successfully.');

      navigate('/users');

    } catch (err) {
      console.error('Error adding user:', err);
      showError('Failed to add user.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Add User
      </h1>

      <UserForm
        onSubmit={handleSubmit}
      />
    </div>
  );
}