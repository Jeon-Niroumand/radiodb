import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/users';
import { useNotification } from '../context/NotificationContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    setLoading(true);

    getUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error("Error loading users:", err);
        showError("Failed to load users.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDisable = async (user) => {
    // We'll implement this next.
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>

      <Link to="/add-user">Add User</Link>

      <table className="data-table">
        <thead>
          <tr className="data-table-header">
            <th>Display Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-4">
                <LoadingSpinner text="Loading users..." />
              </td>
            </tr>

          ) : users.length === 0 ? (

            <tr>
              <td colSpan={7} className="text-center py-4">
                No users found.
              </td>
            </tr>

          ) : (

            users.map(user => (
              <tr key={user.id}>

                <td>{user.display_name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role_name}</td>
                <td>{user.active ? "Yes" : "No"}</td>
                <td>{user.last_login || "-"}</td>

                <td>
                  <div className="actions">

                    <Link
                      to={`/users/edit/${user.id}`}
                      style={{
                        textDecoration: 'none',
                        color: 'black',
                        marginRight: '10px'
                      }}
                    >
                      ✎
                    </Link>

                    <span
                      onClick={() => handleDisable(user)}
                      className="delete-icon"
                      title="Disable User"
                    >
                      🚫
                    </span>

                  </div>
                </td>

              </tr>
            ))

          )}

        </tbody>
      </table>
    </div>
  );
}