import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import CardGenerator from './components/CardGenerator';
import PublicEmployeeView from './components/PublicEmployeeView';
import './App.css';

function App() {
  // دالة للتحقق من تسجيل الدخول
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // مكون للحماية - يتطلب تسجيل الدخول
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* المسار العام - بدون حماية */}
          <Route path="/employee/:id" element={<PublicEmployeeView />} />
          
          {/* المسارات المحمية */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/generator"
            element={
              <ProtectedRoute>
                <CardGenerator />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;