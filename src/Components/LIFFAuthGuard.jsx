import { useLIFF } from '../hooks/useLIFF';

const LIFFAuthGuard = ({ children }) => {
  const { 
    isReady: liffReady, 
    isLoggedIn, 
    userProfile,
    error
  } = useLIFF();

  // Show loading while LIFF is initializing
  if (!liffReady) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">กำลังโหลด...</span>
          </div>
          <h5 className="text-muted">กำลังเชื่อมต่อ LINE...</h5>
          <p className="small text-muted">กรุณารอสักครู่</p>
        </div>
      </div>
    );
  }

  // Show error if LIFF failed to initialize
  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
          <h5 className="text-danger">เกิดข้อผิดพลาดในการเชื่อมต่อ</h5>
          <p className="text-muted">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-redo me-2"></i>
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f0f8ef' }}>
        <div className="card shadow-lg border-0" style={{ maxWidth: '400px', borderRadius: '15px' }}>
          <div className="card-body p-4 text-center">
            {/* App Logo/Brand */}
            <div className="mb-4">
              <i className="fas fa-leaf fa-3x mb-3" style={{ color: '#2d5a3d' }}></i>
              <h4 className="fw-bold" style={{ color: '#2d5a3d' }}></h4>
              <p className="text-muted small">ระบบจัดการแผนการส่งผัก</p>
            </div>

            {/* Login Message */}
            <div className="mb-4">
              <h5 className="text-dark mb-3">ต้องการเข้าสู่ระบบ</h5>
              <p className="text-muted small">
                กรุณาเข้าสู่ระบบผ่าน LINE เพื่อใช้งานแอปพลิเคชัน
              </p>
            </div>

            {/* Login Instructions */}
            <div className="bg-light p-3 rounded mb-4">
              <div className="small text-muted">
                <div className="mb-2">
                  <i className="fas fa-mobile-alt me-2 text-primary"></i>
                  เปิดแอปนี้ผ่าน LINE เท่านั้น
                </div>
                <div className="mb-2">
                  <i className="fas fa-user-check me-2 text-success"></i>
                  ระบบจะเข้าสู่ระบบอัตโนมัติ
                </div>
                <div>
                  <i className="fas fa-shield-alt me-2 text-info"></i>
                  ปลอดภัยด้วย LINE Login
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2">
              <button 
                className="btn btn-success btn-lg"
                onClick={() => {
                  // Try to trigger LIFF login if available
                  if (window.liff && window.liff.login) {
                    window.liff.login();
                  } else {
                    // Fallback: redirect to LINE
                    window.location.href = 'https://line.me/';
                  }
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #06c755, #00b04f)', 
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                <i className="fab fa-line me-2"></i>
                เข้าสู่ระบบด้วย LINE
              </button>
              
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo me-2"></i>
                รีเฟรชหน้า
              </button>
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-top">
              <small className="text-muted">
                🌱 CCF &copy; 2025
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in, show the protected content
  return (
    <>
      {/* Optional: Show user info bar */}
      {userProfile && (
        <div className="bg-success text-white py-1 px-3 small d-none d-md-block">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col">
                <i className="fas fa-user-check me-2"></i>
                ยินดีต้อนรับ {userProfile.displayName}
              </div>
              <div className="col-auto">
                <small className="opacity-75">
                  <i className="fab fa-line me-1"></i>
                  เข้าสู่ระบบแล้ว
                </small>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Render protected content */}
      {children}
    </>
  );
};

export default LIFFAuthGuard;