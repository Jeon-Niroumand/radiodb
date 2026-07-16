import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import UserForm from '../components/UserForm';

import {
  getUser,
  updateUser
} from '../api/users';

import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditUserPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { showSuccess, showError } = useNotification();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    getUser(id)
      .then(data => {
        setUser(data);
      })

      .catch(err => {
        console.error('Error loading user:', err);
        showError('Failed to load user.');
      })

      .finally(() => {
        setLoading(false);
      });

  }, [id]);


  const handleSubmit = async (updatedUser) => {

    try {

      await updateUser(id, updatedUser);

      showSuccess('User updated successfully.');

      navigate('/users');

    } catch (err) {

      console.error('Error updating user:', err);
      showError('Failed to update user.');

    }

  };


  if (loading) {
    return <LoadingSpinner text="Loading user..." />;
  }


  if (!user) {
    return <p>User not found.</p>;
  }


  return (
    <div className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Edit User
      </h1>


      <UserForm
        initialData={user}
        onSubmit={handleSubmit}
      />

    </div>
  );
}