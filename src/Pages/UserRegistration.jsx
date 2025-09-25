import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../Components/AppHeader';
import userService from '../services/userService';

const UserRegistration = ({ userProfile, onRegistrationComplete, onCancel }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: userProfile?.displayName || '',
    phone: '',
    farmName: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
    setError(null);

    try {
         localStorage.setItem("token", "fake-jwt-token");

      // Register user with the API
    //   const response = await userService.registerUser({
    //     lineUserId: userProfile.userId,
    //     displayName: userProfile.displayName,
    //     pictureUrl: userProfile.pictureUrl,
    //     name: formData.name.trim(),
    //     phone: formData.phone.trim(),
    //     farmName: formData.farmName.trim()
    //   });

    //   if (response.success) {
    //     console.log('✅ User registered successfully:', response.user);
        // onRegistrationComplete("registered");
    //   } else {
    //     throw new Error(response.message || 'การลงทะเบียนไม่สำเร็จ');
    //   }
    } catch (error) {
      console.error('❌ Registration error:', error);
      setError(error.message || 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f0f8ef' }}>
      <div className="container-fluid px-2 px-md-3 pt-2 mt-2">
        {/* Header */}
        <AppHeader title="ลงทะเบียนผู้ใช้งาน" />

        {/* Registration Form */}
        <div className="row justify-content-center mt-4">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '15px' }}>
              <div className="card-body p-4 p-md-5">
                {/* Welcome Message */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    {userProfile?.pictureUrl ? (
                      <img 
                        src={userProfile.pictureUrl} 
                        alt="LINE Profile" 
                        className="rounded-circle"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{
                          width: '80px',
                          height: '80px',
                          background: 'linear-gradient(135deg, #2d5a3d, #6cb866)',
                          color: 'white'
                        }}>
                        <i className="fas fa-user fa-2x"></i>
                      </div>
                    )}
                  </div>
                  <h4 className="fw-bold mb-2" style={{ color: '#2d5a3d' }}>
                    ยินดีต้อนรับ!
                  </h4>
                  <p className="text-muted">
                    กรุณากรอกข้อมูลเพิ่มเติมเพื่อใช้งานระบบ
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
                        placeholder="กรอกชื่อฟาร์ม เช่น ฟาร์มจระเข้"
                        required
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #a8d5a3',
                          padding: '12px 16px'
                        }}
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* LINE Info Display */}
                    <div className="col-12">
                      <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                        <h6 className="fw-bold mb-2 text-muted">
                          <i className="fab fa-line me-2"></i>
                          ข้อมูล LINE
                        </h6>
                        <div className="small text-muted">
                          <div className="mb-1">
                            <strong>ชื่อแสดง:</strong> {userProfile?.displayName || 'ไม่พบข้อมูล'}
                          </div>
                          <div>
                            <strong>LINE ID:</strong> {userProfile?.userId || 'ไม่พบข้อมูล'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="col-12">
                      <div className="row g-2 mt-3">
                        <div className="col-6">
                          <button
                            type="button"
                            className="btn btn-outline-secondary w-100 fw-bold"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            style={{
                              borderRadius: '12px',
                              padding: '12px',
                              fontSize: '1.1rem'
                            }}
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            ยกเลิก
                          </button>
                        </div>
                        <div className="col-6">
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
    </div>
  );
};

export default UserRegistration;