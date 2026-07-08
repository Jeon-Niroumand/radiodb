import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RadiosPage from './pages/RadiosPage';
import AddRadioPage from './pages/AddRadioPage';
import EditRadioPage from './pages/EditRadioPage';
import SitesPage from './pages/SitesPage';
import AddSitePage from './pages/AddSitePage';
import EditSitePage from './pages/EditSitePage';

import Notification from './components/Notification';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <Router>
        
        <Notification />

        <Routes>
          <Route path="/" element={<RadiosPage />} />
          <Route path="/add" element={<AddRadioPage />} />
          <Route path="/edit/:id" element={<EditRadioPage />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/add-site" element={<AddSitePage />} />
          <Route path="/sites/edit/:index" element={<EditSitePage />} />
        </Routes>
        
      </Router>
    </NotificationProvider>
  );
}