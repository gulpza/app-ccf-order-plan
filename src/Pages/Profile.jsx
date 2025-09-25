import React, { useState, useEffect } from 'react';
import { useLIFF } from '../hooks/useLIFF';
import BottomNavigation from '../Components/BottomNavigation';
import LIFFAuthGuard from '../Components/LIFFAuthGuard';
import userService from '../services/userService.js';

const Profile = () => {

    useEffect(() => {

    // const verifyUser = async () => {
    //   const lineUserId = '68cc5367-6689-461b-a60c-1e99ce9eb02e-1'; // จาก LINE LIFF

    //   try {
    //     const result = await userService.checkUserExists(lineUserId);
    //     if (!result.status) {
    //       window.location.href = '/register';
    //     }
    //   } catch (error) {
    //     console.error('User verification failed:', error);
    //   }
    // };

    // verifyUser();

  }, []);


  const [activeTab, setActiveTab] = useState('personal');
  
  // LINE LIFF Integration
  const { 
    isReady: liffReady, 
    isLoggedIn, 
    userProfile, 
    isInLineClient,
    closeWindow
  } = useLIFF();

  // Sample user data - in a real app, this would come from an API or user context
  const userData = {
    name: 'Birth', // This would come from registered user data
    phone: '089-123-4567', // This would come from registered user data
    email: userProfile?.email || '-',
    location: 'จังหวัดกรุงเทพมหานคร', // This would come from registered user data
    farmName: 'จระเข้', // This would come from registered user data
    userName: userProfile?.displayName || 'Birth',
    joinDate: '2024-01-15',
    status: 'พร้อมใช้งาน',
    totalOrders: 156,
    completedOrders: 142,
    rating: 4.8
  };

  return (
      <div className="container-fluid px-2 px-md-3 py-3">
      {/* Profile Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-2 shadow-sm" style={{
            borderColor: '#a8d5a3',
            borderRadius: '12px'
          }}>
            <div className="card-body p-3 p-md-4">
              {/* Profile Header */}
              <div className="row align-items-center mb-4">
                <div className="col-auto">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #2d5a3d, #6cb866)',
                      color: 'white'
                    }}>
                    {userProfile?.pictureUrl ? (
                      <img 
                        src={userProfile.pictureUrl} 
                        alt="LINE Profile" 
                        className="rounded-circle w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <i className="fas fa-user fa-2x"></i>
                    )}
                  </div>
                </div>
                <div className="col">
                  <div className="d-flex align-items-center mb-2">
                    <h5 className="mb-0 fw-bold me-2" style={{ color: '#2d5a3d' }}>
                      ฟาร์ม: {userData?.farmName}
                    </h5>
                  </div>
                  <p className="text-muted mb-1">
                    <i className="fas fa-calendar-alt me-1"></i>
                    สถานะ: {userData.status}
                  </p>
                  <div className="d-flex align-items-center">
                    <span className="badge px-2 py-1 me-2" style={{ 
                      backgroundColor: '#4caf50', 
                      color: 'white' 
                    }}>
                      <i className="fas fa-star me-1"></i>
                      {userData.rating}
                    </span>
                    
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <ul className="nav nav-pills nav-fill mb-3" id="profileTabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                    style={{
                      backgroundColor: activeTab === 'personal' ? '#2d5a3d' : 'transparent',
                      color: activeTab === 'personal' ? 'white' : '#2d5a3d',
                      borderRadius: '8px'
                    }}
                  >
                    <i className="fas fa-info-circle me-1"></i>
                    ข้อมูลส่วนตัว
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'personal' && (
                  <div className="tab-pane active">
                    {/* LINE Profile Section */}
                    <div className="mb-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#2d5a3d' }}>
                         <i className="fas fa-seedling me-2"></i>
                        Profile
                      </h6>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-user text-primary me-3"></i>
                            <div>
                              <div className="small text-muted">ชื่อ</div>
                              <div className="fw-bold">{userData.userName}</div>
                            </div>
                          </div>
                        </div>
                        <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-phone text-primary me-3"></i>
                            <div>
                              <div className="small text-muted">เบอร์โทรศัพท์</div>
                              <div className="fw-bold">{userData.phone}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-envelope text-success me-3"></i>
                            <div>
                              <div className="small text-muted">อีเมล</div>
                              <div className="fw-bold">{userData.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-map-marker-alt text-danger me-3"></i>
                            <div>
                              <div className="small text-muted">ที่อยู่</div>
                              <div className="fw-bold">{userData.location}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-id-card text-info me-3"></i>
                            <div>
                              <div className="small text-muted">LINE User ID</div>
                              <div className="fw-bold small text-break">{userProfile?.userId || 'ไม่พบข้อมูล'}</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
      </div>
  );
};

export default Profile;
