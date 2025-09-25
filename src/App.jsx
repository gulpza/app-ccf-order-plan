import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import './App.css';
import ReportOrder from './Pages/ReportOrder';
import PlanOrders from './Pages/PlanOrders';
import Profile from './Pages/Profile';
import UserRegistration from './Pages/UserRegistration';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LIFFAuthGuard from './Components/LIFFAuthGuard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // สมมติว่า token เก็บใน localStorage

  // if (!isAuthenticated) {
  //   return <Navigate to="/register" replace />;
  // }
  return <>{children}</>;
};

function App() {
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