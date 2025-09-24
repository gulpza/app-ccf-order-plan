import React from 'react';
import logo from '../assets/logo.png';

const AppHeader = ({ title = 'แผนการส่งผัก', iconClass = 'fas fa-leaf', iconColor = '#2d5a3d' }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="d-flex align-items-center justify-content-between py-2 py-md-3 position-relative">
          {/* Logo - ด้านซ้าย */}
          <div className="flex-shrink-0">
            <img 
              src={logo} 
              alt="Logo" 
              style={{ 
                height: '3.4rem', 
                width: 'auto',
                objectFit: 'contain' 
              }} 
            />
          </div>
          
          {/* ข้อความกึ่งกลาง */}
          <div className="position-absolute start-50 translate-middle-x text-center">
            <h5 className="mb-0 fw-bold" style={{ color: '#2d5a3d', fontSize: '1.5rem' }}>
              {title}
            </h5>
          </div>
          
          {/* Spacer เพื่อให้สมดุล */}
          <div className="flex-shrink-0" style={{ width: '2rem' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;