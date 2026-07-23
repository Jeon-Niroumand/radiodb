import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RadiosPage from './pages/RadiosPage';
import AddRadioPage from './pages/AddRadioPage';
import EditRadioPage from './pages/EditRadioPage';
import SitesPage from './pages/SitesPage';
import AddSitePage from './pages/AddSitePage';
import EditSitePage from './pages/EditSitePage';
import UsersPage from './pages/UsersPage';
import AddUserPage from './pages/AddUserPage';
import EditUserPage from './pages/EditUserPage';
import Notification from './components/Notification';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';

export default function App() {
  const [searchTerm, setSearchTerm] = React.useState('');
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>          
          <Notification />
          <Header searchTerm={searchTerm} onSearchChange={setSearchTerm}/>
          <Routes>
            <Route path="/" element={<RadiosPage searchTerm={searchTerm} />} />
            <Route path="/add" element={<AddRadioPage />} />
            <Route path="/edit/:id" element={<EditRadioPage />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/add-site" element={<AddSitePage />} />
            <Route path="/sites/edit/:index" element={<EditSitePage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/add-user" element={<AddUserPage />} />
            <Route path="/users/edit/:id" element={<EditUserPage />} />
          </Routes>          
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}