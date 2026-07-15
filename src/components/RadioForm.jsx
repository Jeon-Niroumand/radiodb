import React, { useState, useEffect, useRef } from 'react';
import { getSites } from '../api/sites';

export default function RadioForm({
  onSubmit,
  initialData = {},
  resetSerialTrigger = 0
}) {
  const [model, setModel] = useState(initialData.model || '');
  const [serial, setSerial] = useState('');
  const [siteIndex, setSiteIndex] = useState('');
  const [sites, setSites] = useState([]);
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!model.trim())
      newErrors.model = "Model is required.";
    if (!serial.trim())
      newErrors.serial = "Serial is required.";
    if (!siteIndex)
      newErrors.siteIndex = "Site selection is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const serialInputRef = useRef(null);

  useEffect(() => {
    getSites()
      .then(data => {
        const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name));
        setSites(sorted);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load sites');
      });
  }, []);

  // Populate form when editing or when initialData changes
  useEffect(() => {
  if (initialData && Object.keys(initialData).length > 0) {
    setModel(initialData.model || '');
    setSerial(initialData.serial || '');
    setSiteIndex(initialData.site_index ?? '');
  }
  }, [initialData?.id]);

  // For AddRadioPage barcode workflow: clear serial and refocus after save
  useEffect(() => {
    if (resetSerialTrigger > 0) {
      setSerial('');
      if (serialInputRef.current) {
        serialInputRef.current.focus();
      }
    }
  }, [resetSerialTrigger]);

  // Derived values for site details based on selected site
  const selectedSite = sites.find(
    site => site.index === Number(siteIndex)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSubmit({
        model: model.trim(),
        serial: serial.trim(),
        site_index: siteIndex === '' ? null : Number(siteIndex),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const MODELS = ['BPR50', 'CP200', 'CP200D', 'R2']; // List of models for dropdown - can be expanded later
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Model:</label>
        <select
          value={model}
          disabled={isSaving}
          onChange={e => {
             setModel(e.target.value);
             setErrors(prev => ({ ...prev, model: '' })); // Clear model error on change
          }}
          className="border p-1 w-full"
        >
          <option value="">Select model...</option>
          {MODELS.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {errors.model && <p className="text-red-500">{errors.model}</p>}
      </div>

      <div>
        <label>Serial:</label>
        <input
          type="text"
          value={serial}
          disabled={isSaving}
          onChange={e => {
            setSerial(e.target.value);
            setErrors(prev => ({ ...prev, serial: '' })); // Clear serial error on change
          }}
          ref={serialInputRef}
        />
        {errors.serial && <p className="text-red-500">{errors.serial}</p>}
      </div>

      <div>
        <label>Site:</label>
        <select
          value={siteIndex}
          disabled={isSaving}
          onChange={e => {
            setSiteIndex(e.target.value);
            setErrors(prev => ({ ...prev, siteIndex: '' })); // Clear site_index error on change
          }}
        >
          <option value="">Select site...</option>
          {sites.map(site => (
            <option key={site.index} value={site.index}>
              {site.name} ({site.type})
            </option>
          ))}
        </select>
        {errors.siteIndex && <p className="text-red-500">{errors.siteIndex}</p>}
      </div>

      {siteIndex !== '' && (
        <>
          <div>
            <label>Site Name:</label>
            <input
              value={selectedSite?.name || ""}
              readOnly
              disabled
            />
            {errors.site_name && <p className="text-red-500">{errors.site_name}</p>}
          </div>

          <div>
            <label>Site Type:</label>
            <input
              value={selectedSite?.type || ""}
              readOnly
              disabled
            />
          </div>

          <div>
            <label>Frequency:</label>
            <input
              value={selectedSite?.frequency || ""}
              readOnly
              disabled
              type="text"
            />
          </div>

          <div>
            <label>Repeater RX Frequency:</label>
            <input
              value={selectedSite?.repeater_rx || ""}
              readOnly
              disabled
              type="text"
            />
          </div>

          <div>
            <label>Repeater TX Frequency:</label>
            <input
              value={selectedSite?.repeater_tx || ""}
              readOnly
              disabled
              type="text"
            />
          </div>

          <div>
            <label>PL Code:</label>
            <input
              value={selectedSite?.plcode || ""}
              readOnly
              disabled
              type="text"
            />
          </div>
        </>
      )}

      <button 
          type="submit"
          disabled={isSaving}
      >
          {isSaving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}