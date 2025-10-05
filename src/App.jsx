import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import './App.css';
import ReportOrder from './Pages/ReportOrder';
import PlanOrders from './Pages/PlanOrders';
import Profile from './Pages/Profile';
import UserRegistration from './Pages/UserRegistration';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LIFFAuthGuard from './Components/LIFFAuthGuard';
import { useLIFF } from './hooks/useLIFF';
import useUser from './hooks/useUser';

const ProtectedRoute = ({ children }) => {
  const { userProfile } = useLIFF();
  const { getUserProfile } = useUser();
  const [isCheckingProfile, setIsCheckingProfile] = React.useState(false);
  const [profileChecked, setProfileChecked] = React.useState(false);

  // Check user profile if not exists
  React.useEffect(() => {
    const checkUserProfile = async () => {
      // Wait for userProfile to be loaded
      if (!userProfile?.userId) {
        return;
      }

      // ✅ Always fetch fresh profile data on page load
      setIsCheckingProfile(true);
      const userId = userProfile.userId;
   
      try {
        const res = await getUserProfile(userId);
        
        if (res.success && res.data) {
          // User found - store profile
          localStorage.setItem('profile', JSON.stringify(res.data));
          localStorage.setItem('userId', userId);
          setProfileChecked(true);
        } else {
          // User not found - redirect to register
          window.location.href = '/register';
        }
      } catch (err) {
        console.error('❌ Error fetching user profile:', err);
        // On error, redirect to register
        window.location.href = '/register';
      } finally {
        setIsCheckingProfile(false);
      }
    };
    
    checkUserProfile();
  }, [userProfile?.userId]); // ✅ Run when userProfile changes

  // Show loading while checking profile
  if (!profileChecked || isCheckingProfile) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f0f8ef' }}>
        <div className="text-center">
          {/* ✅ ใบกระเพรา pulse animation */}
          <div className="mb-3" style={{ 
            animation: 'leafPulse 1.5s ease-in-out infinite',
            display: 'inline-block'
          }}>
            <i className="fas fa-leaf" style={{ 
              fontSize: '5rem', 
              color: '#2d5a3d'
            }}></i>
          </div>
          <p className="text-muted fw-bold" style={{ color: '#2d5a3d' }}>
            กำลังตรวจสอบข้อมูล
          </p>
          
          {/* CSS Animation */}
          <style>{`
            @keyframes leafPulse {
              0%, 100% { 
                transform: scale(1);
                opacity: 1;
              }
              50% { 
                transform: scale(1.2);
                opacity: 0.7;
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Show content only after profile is checked
  return <>{children}</>;
};

function App() {
    const env = import.meta.env.VITE_ENV;

  // Initialize VConsole for mobile debugging
  useEffect(() => {
    // Only load VConsole in development or when debug=true is in URL
    if (env === 'development' || window.location.search.includes('debug=true')) {
      // Try to load vconsole dynamically
      import('vconsole').then((VConsole) => {
        new VConsole.default();
      }).catch((error) => {
        console.warn('VConsole not available, loading from CDN:', error);     
        // Fallback: Load VConsole from CDN
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/vconsole@latest/dist/vconsole.min.js';
        script.onload = () => {
          // eslint-disable-next-line no-undef
          new VConsole();
        };
        document.head.appendChild(script);
      });
    }
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
          
          {/* ✅ Public Route - Register */}
          <Route path="/register" element={<UserRegistration />} />
        </Routes>
      </div>
      </LIFFAuthGuard>
    </Router>
  );
}

export default App;