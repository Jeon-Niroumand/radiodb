import React, { useEffect, useState } from 'react';
import { getRoles } from '../api/roles';

export default function UserForm({
  onSubmit,
  initialData = {}
}) {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');
  const [active, setActive] = useState(true);

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getRoles()
      .then(setRoles)
      .catch(err => {
        console.error(err);
        alert('Failed to load roles');
      });
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDisplayName(initialData.display_name || '');
      setUsername(initialData.username || '');
      setEmail(initialData.email || '');
      setRoleId(initialData.role_id ?? '');
      setActive(initialData.active ?? true);
    }
  }, [initialData?.id]);

  const validateForm = () => {
    const newErrors = {};

    if (!displayName.trim())
      newErrors.displayName = 'Display Name is required.';

    if (!username.trim())
      newErrors.username = 'Username is required.';

    if (!roleId)
      newErrors.roleId = 'Role is required.';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      await onSubmit({
        display_name: displayName.trim(),
        username: username.trim(),
        email: email.trim(),
        role_id: Number(roleId),
        active
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label>Display Name:</label>
        <input
          value={displayName}
          disabled={isSaving}
          onChange={e => {
            setDisplayName(e.target.value);
            setErrors(prev => ({ ...prev, displayName: '' }));
          }}
        />
        {errors.displayName && <p className="text-red-500">{errors.displayName}</p>}
      </div>

      <div>
        <label>Username:</label>
        <input
          value={username}
          disabled={isSaving}
          onChange={e => {
            setUsername(e.target.value);
            setErrors(prev => ({ ...prev, username: '' }));
          }}
        />
        {errors.username && <p className="text-red-500">{errors.username}</p>}
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          disabled={isSaving}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Role:</label>
        <select
          value={roleId}
          disabled={isSaving}
          onChange={e => {
            setRoleId(e.target.value);
            setErrors(prev => ({ ...prev, roleId: '' }));
          }}
        >
          <option value="">Select role...</option>

          {roles.map(role => (
            <option
              key={role.id}
              value={role.id}
            >
              {role.name}
            </option>
          ))}
        </select>

        {errors.roleId && <p className="text-red-500">{errors.roleId}</p>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={active}
            disabled={isSaving}
            onChange={e => setActive(e.target.checked)}
          />

          Active
        </label>
      </div>

      <button
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : 'Save'}
      </button>

    </form>
  );
}