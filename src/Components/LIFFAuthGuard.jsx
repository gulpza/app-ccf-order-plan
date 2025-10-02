import { useLIFF } from '../hooks/useLIFF';

const LIFFAuthGuard = ({ children }) => {
  const { 
    isReady: liffReady, 
    isLoggedIn, 
    userProfile,
    error
  } = useLIFF();

  // ✅ เช็คว่าเปิดผ่าน LINE app หรือไม่
  const isInLineApp = window.liff?.isInClient();
  
  // Show loading while LIFF is initializing
  if (!liffReady) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
          </div>
        </div>
      </div>
    );
  }

  // ✅ เช็คว่าต้องเปิดผ่าน LINE app เท่านั้น
  if (!isInLineApp) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f0f8ef' }}>
        <div className="card shadow-lg border-0" style={{ maxWidth: '400px', borderRadius: '15px' }}>
          <div className="card-body p-4 text-center">
            <div className="mb-4">
              <i className="fab fa-line fa-4x mb-3 text-success"></i>
              <h4 className="fw-bold text-danger mb-3">โปรดเปิดผ่าน LINE</h4>
            </div>

            <div className="alert alert-warning" role="alert">
              <i className="fas fa-exclamation-triangle me-2"></i>
              แอปนี้ต้องเปิดผ่าน LINE Official Account เท่านั้น
            </div>

            <div className="bg-light p-3 rounded mb-4">
              <div className="text-start small">
                <p className="fw-bold mb-2">วิธีเปิด:</p>
                <ol className="mb-0 ps-3">
                  <li>เปิดแอป LINE บนมือถือ</li>
                  <li>ค้นหา Official Account ของเรา</li>
                  <li>กดเมนูเพื่อเข้าใช้งานแอป</li>
                </ol>
              </div>
            </div>

            <div className="d-grid">
              <a 
                href="https://line.me/R/ti/p/@YOUR_LINE_ID" 
                className="btn btn-success btn-lg"
                style={{ 
                  background: 'linear-gradient(135deg, #06c755, #00b04f)', 
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                <i className="fab fa-line me-2"></i>
                เปิด LINE Official Account
              </a>
            </div>
          </div>
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
            <div className="mb-4">
              <i className="fas fa-leaf fa-3x mb-3" style={{ color: '#2d5a3d' }}></i>
              <h4 className="fw-bold" style={{ color: '#2d5a3d' }}>CCF Order Plan</h4>
              <p className="text-muted small">ระบบจัดการแผนการส่งผัก</p>
            </div>

            <div className="mb-4">
              <h5 className="text-dark mb-3">ต้องการเข้าสู่ระบบ</h5>
              <p className="text-muted small">
                กรุณาเข้าสู่ระบบผ่าน LINE เพื่อใช้งานแอปพลิเคชัน
              </p>
            </div>

            <div className="d-grid gap-2">
              <button 
                className="btn btn-success btn-lg"
                onClick={() => {
                  if (window.liff && window.liff.login) {
                    window.liff.login();
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in, show the protected content
  return <>{children}</>;
};

export default LIFFAuthGuard;