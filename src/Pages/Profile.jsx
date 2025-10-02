import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLIFF } from '../hooks/useLIFF';
import BottomNavigation from '../Components/BottomNavigation';

const Profile = () => {
  const navigate = useNavigate();
  useEffect(() => {
  }, []);

  const [activeTab, setActiveTab] = useState('personal');
  const apiUrl = import.meta.env.VITE_SHEET_API_KEY; 
  // LINE LIFF Integration
  const { 
    isReady: liffReady, 
    userProfile,
  } = useLIFF();

  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: userProfile?.email || '-',
    location: '',
    farmName: '',
    userName: userProfile?.displayName ?? '-',
    displayName: '',
    joinDate: '',
    status: '',
    farmCode: '',
    userType: '',
    latestDate: '',
    lineId: '',
    rating: 5.0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Status mapping function
  const getStatusLabel = (status) => {
    const statusMap = {
      'active': 'ปกติ',
      'inactive': 'ยกเลิก',
      'wait-approve': 'รออนุมัติ'
    };
    return statusMap[status] || status;
  };

  // Status color mapping function
  const getStatusColor = (status) => {
    const colorMap = {
      'active': '#28a745',      // green
      'inactive': '#dc3545',    // red
      'wait-approve': '#ffc107' // yellow
    };
    return colorMap[status] || '#6c757d'; // default gray
  };

  // Load user data from localStorage
  useEffect(() => {
    const loadProfileFromLocalStorage = () => {
      try {
        const profileData = localStorage.getItem('profile');
        
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);
          
          setUserData(prevData => ({
            ...prevData,
            name: parsedProfile.Name || '',
            phone: parsedProfile.Phone || '',
            farmName: parsedProfile.FarmName || '',
            status: parsedProfile.Status || '',
            farmCode: parsedProfile.FarmCode || '',
            userType: parsedProfile.UserType || '',
            lineId: parsedProfile.LineId || '',
            displayName: parsedProfile.DisplayName || '',
            joinDate: parsedProfile.CreatedDate || '',
            latestDate: parsedProfile.LatestDate || ''
          }));
        } else {
          console.error('❌ No profile found in localStorage');
          setError('ไม่พบข้อมูลผู้ใช้');
          navigate('/register');
        }
      } catch (error) {
        console.error('❌ Error loading profile from localStorage:', error);
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
      }
    };

    loadProfileFromLocalStorage();
  }, []);

  // Error state
  if (error) {
    return (
      <div className="container-fluid px-2 px-md-3 py-3">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">เกิดข้อผิดพลาด</h4>
          <p>{error}</p>
          <hr />
          <button 
            className="btn btn-outline-danger" 
            onClick={() => navigate('/register')}
          >
            ไปหน้าลงทะเบียน
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="container-fluid px-2 px-md-3 py-3 position-relative">
      
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
                    สถานะ: 
                    <span 
                      className="badge ms-1 px-2 py-1" 
                      style={{ 
                        backgroundColor: getStatusColor(userData.status),
                        color: 'white',
                        fontSize: '0.75rem'
                      }}
                    >
                      {getStatusLabel(userData.status)}
                    </span>
                  </p>
                  <div className="d-flex align-items-center">
                    <i className="fas fa-star me-1" style={{ color: '#ffc107' }}></i>
                     คะแนน: 
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
                              <div className="fw-bold">{userData.name}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-user-tag text-secondary me-3"></i>
                            <div>
                              <div className="small text-muted">ชื่อผู้ใช้ LINE</div>
                              <div className="fw-bold">{userData.displayName}</div>
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
                             <div className="col-12 col-md-6">
                          <div className="d-flex align-items-center p-3 bg-light rounded">
                            <i className="fas fa-id-card text-info me-3"></i>
                            <div>
                              <div className="small text-muted">LINE User ID</div>
                              <div className="fw-bold small text-break">{userData?.lineId || 'ไม่พบข้อมูล'}</div>
                            </div>
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
