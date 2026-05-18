import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Detection from './pages/Detection.jsx';
import Duplicates from './pages/Duplicates.jsx';
import Tracking from './pages/Tracking.jsx';
import Milestones from './pages/Milestones.jsx';
import AdminLogin from './pages/AdminLogin.jsx';       // Added
import AdminDashboard from './pages/AdminDashboard.jsx'; // Added

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/detect" element={<Detection />} />
        <Route path="/duplicates" element={<Duplicates />} />
        <Route path="/track/:id" element={<Tracking />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;