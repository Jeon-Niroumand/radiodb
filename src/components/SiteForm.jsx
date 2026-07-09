import React, { useState } from 'react';

export default function SiteForm({ 
  onSubmit, 
  initialData = {},
  resetSerialTrigger = 0
  
}) {
  const [index, setIndex] = useState(initialData.index || '');
  const [name, setName] = useState(initialData.name || '');
  const [type, setType] = useState(initialData.type || '');
  const [frequency, setFrequency] = useState(initialData.frequency || 151.775);
  const [repeaterRx, setRepeaterRx] = useState(initialData.repeater_rx || '');
  const [repeaterTx, setRepeaterTx] = useState(initialData.repeater_tx || '');
  const [plcode, setPlcode] = useState(initialData.plcode || '');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!index)
      newErrors.index = "Index is required.";

    if (!name.trim())
      newErrors.name = "Name is required.";

    if (!type.trim())
      newErrors.type = "Type is required.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      await onSubmit({
        index: Number(index),
        name: name.trim(),
        type: type.trim(),
        frequency: Number(frequency),
        repeater_rx: repeaterRx ? Number(repeaterRx) : null,
        repeater_tx: repeaterTx ? Number(repeaterTx) : null,
        plcode: plcode || null
    })
    } finally {
        setIsSaving(false);
    }    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Index:</label>
        <input disabled={isSaving} type="number" value={index} onChange={e => {
                                                                setIndex(e.target.value);
                                                                setErrors(prev => ({ ...prev, index: '' })); // Clear index error on change
                                                              }} className="border p-1 w-full" />
        {errors.index && <p className="text-red-500">{errors.index}</p>}
      </div>
      <div>
        <label>Name:</label>
        <input disabled={isSaving} value={name} onChange={e => {
                                                  setName(e.target.value);
                                                  setErrors(prev => ({ ...prev, name: '' })); // Clear name error on change
                                                }}
                                                  className="border p-1 w-full" />
        {errors.name && <p className="text-red-500">{errors.name}</p>}
      </div>
      <div>
        <label>Type:</label>
        <input disabled={isSaving} value={type} onChange={e => {
                                                  setType(e.target.value);
                                                  setErrors(prev => ({ ...prev, type: '' })); // Clear type error on change
                                                }}
                                                  className="border p-1 w-full" />
        {errors.type && <p className="text-red-500">{errors.type}</p>}
      </div>
      <div>
        <label>Frequency (MHz):</label>
        <input disabled={isSaving} type="number" step="0.001" value={frequency} onChange={e => setFrequency(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Repeater RX (MHz):</label>
        <input disabled={isSaving} type="number" step="0.001" value={repeaterRx} onChange={e => setRepeaterRx(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Repeater TX (MHz):</label>
        <input disabled={isSaving} type="number" step="0.001" value={repeaterTx} onChange={e => setRepeaterTx(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>PL Code:</label>
        <input disabled={isSaving} value={plcode} onChange={e => setPlcode(e.target.value)} className="border p-1 w-full" />
      </div>
      <button disabled={isSaving} type="submit" className="bg-green-600 text-white px-3 py-1 rounded">{isSaving ? "Saving..." : "Save"}</button>
    </form>
  );
}