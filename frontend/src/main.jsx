import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import PersonalDashboard from './PersonalDashboard.jsx'

function ProtectedRoute({ element }) {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<PersonalDashboard />} />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  </StrictMode>,
)