import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import ReportOrder from './Pages/ReportOrder';
import PlanOrders from './Pages/PlanOrders';
import Profile from './Pages/Profile';
import UserRegistration from './Pages/UserRegistration';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LIFFAuthGuard from './Components/LIFFAuthGuard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("userId"); // Check if userId exists in localStorage

  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  return <>{children}</>;
};

function App() {
  // Initialize VConsole for mobile debugging
  useEffect(() => {
    // Only load VConsole in development or when debug=true is in URL
    // if (process.env.NODE_ENV === 'development' || window.location.search.includes('debug=true')) {
      // Try to load vconsole dynamically
      import('vconsole').then((VConsole) => {
        new VConsole.default();
        console.log('📱 VConsole initialized for mobile debugging');
      }).catch((error) => {
        console.warn('VConsole not available, loading from CDN:', error);     
        // Fallback: Load VConsole from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
        script.onload = () => {
          // eslint-disable-next-line no-undef
          new VConsole();
          console.log('📱 VConsole loaded from CDN');
        };
        document.head.appendChild(script);
      });
    // }
  }, []);

  return (
    <Router>
      <LIFFAuthGuard>
        <div className="container mt-10 mb-10">
          <Routes>
            <Route path="/" element={<Navigate to="/plan/orders" replace />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/report/orders"
              element={
                <ProtectedRoute>
                  <ReportOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/plan/orders"
              element={
                <ProtectedRoute>
                  <PlanOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<UserRegistration />} />
          </Routes>
        </div>
      </LIFFAuthGuard>
    </Router>
  );
}

export default App;