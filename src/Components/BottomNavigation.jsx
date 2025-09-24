import React from 'react';
import { useNavigate } from 'react-router-dom';

const BottomNavigation = ({ activeTab = 'plan' }) => {
  const navigate = useNavigate();

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  const getButtonStyle = (isActive) => ({
    color: isActive ? '#00822eff' : '#000000ff'
  });

  return (
    <>
      {/* Bottom Navigation Footer */}
      <div className="fixed-bottom bg-white border-top shadow-sm">
        <div className="container-fluid">
          <div className="row text-center py-2">
            <div className="col-4">
              <button 
                className="btn btn-link text-decoration-none p-2 w-100" 
                style={getButtonStyle(activeTab === 'plan')}
                onClick={() => handleNavigation('/plan/orders')}
              >
                <div>
                  <i className="fas fa-clipboard-list fa-lg mb-1"></i>
                </div>
                <div className={`small ${activeTab === 'plan' ? 'fw-bold' : ''}`}>แผน</div>
              </button>
            </div>
            <div className="col-4">
              <button 
                className="btn btn-link text-decoration-none p-2 w-100" 
                style={getButtonStyle(activeTab === 'report')}
                onClick={() => handleNavigation('/report/orders')}
              >
                <div>
                  <i className="fas fa-chart-bar fa-lg mb-1"></i>
                </div>
                <div className={`small ${activeTab === 'report' ? 'fw-bold' : ''}`}>รายงาน</div>
              </button>
            </div>
            <div className="col-4">
              <button 
                className="btn btn-link text-decoration-none p-2 w-100" 
                style={getButtonStyle(activeTab === 'profile')}
                onClick={() => handleNavigation('/profile')}
              >
                <div>
                  <i className="fas fa-user fa-lg mb-1"></i>
                </div>
                <div className={`small ${activeTab === 'profile' ? 'fw-bold' : ''}`}>ฉัน</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add bottom padding to prevent content from being hidden behind fixed footer */}
      <div style={{ height: '80px' }}></div>
    </>
  );
};

export default BottomNavigation;