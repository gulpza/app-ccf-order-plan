import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../Components/AppHeader';
import axios from 'axios';
import { useLIFF } from '../hooks/useLIFF';

const UserRegistration = ({  }) => {

    // LINE LIFF Integration
    const { 
      isReady: liffReady,
      userProfile
    } = useLIFF();
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    name: '',
    phone: '',
    farmName: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const apiUrl = import.meta.env.VITE_SHEET_FARM_API_KEY;

  const registerUserAPI = async (userData) => {
    try {
     const response = await axios.post(apiUrl, new URLSearchParams({
      action: 'add-user-line',
        lineId: userData.lineUserId,
        displayName: userData.displayName,
        name: userData.name,
        phone: userData.phone,
        farmName: userData.farmName,
        address: userData.address
    }), {
      timeout: 15000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
      
      return {
        success: true,
        data: response.data
      };
      
    } catch (error) {
      console.error('❌ Error registering user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.farmName.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      // เรียก API เพื่อลงทะเบียนผู้ใช้
      const apiResult = await registerUserAPI({
        lineUserId: userProfile?.userId || '',
        displayName: userProfile?.displayName || '',
        name: formData.name?.trim() || '',
        phone: `'${formData.phone?.trim() || ''}`,
        farmName: formData.farmName?.trim() || '',
        address: formData.address?.trim() || ''
      });

      if (!apiResult.success) {
        throw new Error('ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง');
      }

      // แสดง modal สำเร็จ
      setShowSuccessModal(true);

    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle success modal confirm
  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    // Redirect ไปหน้า profile
    navigate('/profile');
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f0f8ef' }}>
      <div className="container-fluid px-2 px-md-3 pt-2 mt-2">
        {/* Header */}
        {/* <AppHeader title="ลงทะเบียนผู้ใช้งาน" /> */}
        {/* Registration Form */}
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4 p-md-5">
                {/* Welcome Message */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
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
                  <h4 className="fw-bold mb-2" style={{ color: '#2d5a3d' }}>
                    ยินดีต้อนรับ!
                  </h4>
                  <p className="text-muted">
                    กรุณากรอกข้อมูลลงทะเบียนใช้งานระบบ
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Name Field */}
                    <div className="col-12">
                      <label htmlFor="name" className="form-label fw-bold" style={{ color: '#2d5a3d' }}>
                        <i className="fas fa-user me-2"></i>
                        ชื่อ-นามสกุล *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อ-นามสกุล"
                        required
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #a8d5a3',
                          padding: '12px 16px'
                        }}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label fw-bold" style={{ color: '#2d5a3d' }}>
                        <i className="fas fa-phone me-2"></i>
                        เบอร์โทรศัพท์ *
                      </label>
                      <input
                        type="tel"
                        className="form-control form-control-lg"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="กรอกเบอร์โทรศัพท์"
                        required
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #a8d5a3',
                          padding: '12px 16px'
                        }}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Farm Name Field */}
                    <div className="col-12">
                      <label htmlFor="farmName" className="form-label fw-bold" style={{ color: '#2d5a3d' }}>
                        <i className="fas fa-seedling me-2"></i>
                        ชื่อฟาร์ม *
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="farmName"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleInputChange}
                        placeholder="กรอกชื่อฟาร์ม"
                        required
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #a8d5a3',
                          padding: '12px 16px'
                        }}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* ✅ Address Field */}
                    <div className="col-12">
                      <label htmlFor="address" className="form-label fw-bold" style={{ color: '#2d5a3d' }}>
                        <i className="fas fa-map-marker-alt me-2"></i>
                        ที่อยู่
                      </label>
                      <textarea
                        className="form-control form-control-lg"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="กรอกที่อยู่"
                        rows="2"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #a8d5a3',
                          padding: '12px 16px',
                          resize: 'vertical'
                        }}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* LINE Info Display */}
                    <div className="col-12">
                      <div className="bg-light p-4 rounded" style={{ borderRadius: '10px', border: '2px solid #e8f5e8' }}>
                        <h6 className="fw-bold mb-3 text-success">
                          <i className="fab fa-line me-2"></i>
                          ข้อมูล LINE ของคุณ
                        </h6>
                        
                        {/* LINE User ID */}
                        <div className="border-top pt-3">
                          <div className="row">
                            <div className="col-4 col-sm-4">
                              <strong className="text-muted small">LINE ID:</strong>
                            </div>
                            <div className="col-8 col-sm-8">
                              <code className="bg-white px-2 py-1 rounded border text-dark small">
                                {userProfile?.userId || 'ไม่พบข้อมูล'}
                              </code>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-12">
                      <div className="row g-2 mt-3">
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn w-100 fw-bold"
                            disabled={isSubmitting}
                            style={{ 
                              background: '#2d5a3d',
                              borderColor: '#2d5a3d',
                              color: 'white',
                              borderRadius: '12px',
                              padding: '12px',
                              fontSize: '1.1rem'
                            }}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-2" role="status">
                                  <span className="visually-hidden">กำลังบันทึก...</span>
                                </div>
                                กำลังบันทึก...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-user-plus me-2"></i>
                                ลงทะเบียน
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1060 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="modal-content" style={{ borderRadius: '12px' }}>
              <div className="modal-body text-center py-4">
                <div className="mb-3">
                  <i className="fas fa-check-circle text-success mb-3" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mb-2">ลงทะเบียนสำเร็จ!</h5>
                  <p className="text-muted mb-0">ยินดีต้อนรับเข้าสู่ระบบ</p>
                </div>
                
                <button
                  type="button"
                  className="btn w-100 fw-bold"
                  style={{ 
                    background: '#2d5a3d',
                    borderColor: '#2d5a3d',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '1.1rem'
                  }}
                  onClick={handleSuccessConfirm}
                >
                  <i className="fas fa-arrow-right me-2"></i>
                  ไปยังหน้าโปรไฟล์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRegistration;