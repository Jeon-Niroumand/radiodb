import React, { useState } from 'react';

export default function SiteForm({ onSubmit, initialData = {} }) {
  const [index, setIndex] = useState(initialData.index || '');
  const [name, setName] = useState(initialData.name || '');
  const [type, setType] = useState(initialData.type || '');
  const [frequency, setFrequency] = useState(initialData.frequency || 151.775);
  const [repeaterRx, setRepeaterRx] = useState(initialData.repeater_rx || '');
  const [repeaterTx, setRepeaterTx] = useState(initialData.repeater_tx || '');
  const [plcode, setPlcode] = useState(initialData.plcode || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      index: Number(index),
      name,
      type,
      frequency: Number(frequency),
      repeater_rx: repeaterRx ? Number(repeaterRx) : null,
      repeater_tx: repeaterTx ? Number(repeaterTx) : null,
      plcode: plcode || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Index:</label>
        <input type="number" value={index} onChange={e => setIndex(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Type:</label>
        <input value={type} onChange={e => setType(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Frequency (MHz):</label>
        <input type="number" step="0.001" value={frequency} onChange={e => setFrequency(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Repeater RX (MHz):</label>
        <input type="number" step="0.001" value={repeaterRx} onChange={e => setRepeaterRx(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>Repeater TX (MHz):</label>
        <input type="number" step="0.001" value={repeaterTx} onChange={e => setRepeaterTx(e.target.value)} className="border p-1 w-full" />
      </div>
      <div>
        <label>PL Code:</label>
        <input value={plcode} onChange={e => setPlcode(e.target.value)} className="border p-1 w-full" />
      </div>
      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
    </form>
  );
}