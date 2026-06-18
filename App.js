import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RadiosPage from '.pages/RadiosPage';
import AddRadioPage from '.pages/AddRadioPage';
import EditRadioPage from '.pages/EditRadioPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RadiosPage />} />
        <Route path="/add" element={<AddRadioPage />} />
        <Route path="/edit/:id" element={<EditRadioPage />} />
      </Routes>
    </Router>
  );
}

export default App;