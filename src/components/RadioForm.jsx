import React, { useState, useEffect, useRef } from 'react';
import { getSites } from '../api/sites';

export default function RadioForm({ onSubmit, initialData = {}, resetSerialTrigger }) {
  const [model, setModel] = useState(initialData.model || '');
  const [serial, setSerial] = useState(initialData.serial || '');
  const [siteIndex, setSiteIndex] = useState(initialData.site_index || '');
  const [sites, setSites] = useState([]);
  const [siteName, setSiteName] = useState('');
  const [siteType, setSiteType] = useState('');
  const [siteFrequency, setSiteFrequency] = useState('');
  const [siteRepeaterTx, setSiteRepeaterTx] = useState('');
  const [siteRepeaterRx, setSiteRepeaterRx] = useState('');
  const [sitePlCode, setSitePlCode] = useState('');
  const serialInputRef = useRef(null);

  useEffect(() => {
    getSites()
      .then(data => {
        // Sort alphabetically by site name
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setSites(sorted);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to load sites');
      });
  }, []);

  useEffect(() => {
    const found = sites.find(site => site.index === Number(siteIndex));
    if (found) {
      setSiteName(found.name);
      setSiteType(found.type);
      setSiteFrequency(found.frequency);
      setSiteRepeaterTx(found.repeater_tx);
      setSiteRepeaterRx(found.repeater_rx);
      setSitePlCode(found.plcode);
    } else {
      setSiteName('');
      setSiteType('');
      setSiteFrequency('');
      setSiteRepeaterTx('');
      setSiteRepeaterRx('');
      setSitePlCode('');
    }
  }, [siteIndex, sites]);

  useEffect(() => {
    serialInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (resetSerialTrigger !== undefined) {
      setSerial(''); // Clear serial field
      serialInputRef.current?.focus(); // Refocus for next scan/input
    }
  }, [resetSerialTrigger]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const radio = {
      model,
      serial,
      site_index: Number(siteIndex), //fk to sites.index
      frequency: siteFrequency,
      repeater_tx_frequency: siteRepeaterTx,
      repeater_rx_frequency: siteRepeaterRx,
      pl: sitePlCode
    };
    onSubmit(radio);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Model:</label>
        <input
          value={model}
          onChange={e => setModel(e.target.value)}
          className="border p-1 w-full"
        />
      </div>
      <div>
        <label>Serial:</label>
        <input
          type="text"
          value={serial}
          onChange={e => setSerial(e.target.value)}
          ref={serialInputRef}
          className="border p-1 w-full"
        />
      </div>
      <div>
        <label>Site:</label>
        <select
          value={siteIndex}
          onChange={e => setSiteIndex(e.target.value)}
          className="border p-1 w-full"
        >
          <option value="">Select site...</option>
          {sites.map(site => (
            <option key={site.index} value={site.index}>
              {site.name} ({site.type})
            </option>
          ))}
        </select>
      </div>

      {siteIndex && (
        <>
          <div>
            <label>Site Name:</label>
            <input
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="border p-1 w-full"
            />
          </div>
          <div>
            <label>Site Type:</label>
            <input
              value={siteType}
              onChange={e => setSiteType(e.target.value)}
              className="border p-1 w-full"
            />
          </div>
          <div>
            <label>Frequency:</label>
            <input
              value={siteFrequency}
              onChange={e => setSiteFrequency(e.target.value)}
              type="text"
              placeholder="Frequency"
              className="border p-1 w-full"
            />
          </div>
          <div>
            <label>Repeater RX Frequency:</label>
            <input
              value={siteRepeaterRx}
              onChange={e => setSiteRepeaterRx(e.target.value)}
              type="text"
              placeholder="Repeater RX Frequency"
              className="border p-1 w-full"
            />
          </div>
          <div>
            <label>Repeater TX Frequency:</label>
            <input
              value={siteRepeaterTx}
              onChange={e => setSiteRepeaterTx(e.target.value)}
              type="text"
              placeholder="Repeater TX Frequency"
              className="border p-1 w-full"
            />
          </div>
          <div>
            <label>PL Code:</label>
            <input
              value={sitePlCode}
              onChange={e => setSitePlCode(e.target.value)}
              type="text"
              placeholder="PL Code"
              className="border p-1 w-full"
            />
          </div>        
        </>
      )}

      <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
    </form>
  );
}