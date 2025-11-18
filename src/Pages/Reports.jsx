import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../Components/BottomNavigation';
import AppHeader from '../Components/AppHeader';

const Reports = () => {
  const navigate = useNavigate();

  const reportMenus = [
    {
      id: 'weight',
      title: 'รายงานน้ำหนัก',
      description: 'รายงานน้ำหนัก',
      icon: 'fa-balance-scale',
      iconColor: '#4caf50',
      path: '/report/weight'
    },
    {
      id: 'delivery',
      title: 'รายงานส่งผัก',
      description: 'รายงานส่งผัก',
      icon: 'fa-truck-loading',
      iconColor: '#2196f3',
      path: '/report/delivery'
    }
  ];

  const handleMenuClick = (path) => {
    navigate(path);
  };

  return (
    <div className="container-fluid px-2 px-md-3 pt-0 mt-2">
      {/* Header */}
      <AppHeader title="รายงาน" />

      {/* Report Menu Cards */}
      <div className="row g-3 mb-5 pb-5">
        {reportMenus.map((menu) => (
          <div key={menu.id} className="col-12 col-md-6">
            <div
              className="card h-100 shadow-sm border-0"
              onClick={() => handleMenuClick(menu.path)}
              style={{
                cursor: 'pointer',
                borderRadius: '15px',
                transition: 'all 0.3s ease',
                background: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              <div className="card-body p-4 text-center">
                {/* Icon */}
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `${menu.iconColor}15`
                  }}
                >
                  <i
                    className={`fas ${menu.icon} fa-3x`}
                    style={{ color: menu.iconColor }}
                  ></i>
                </div>

                {/* Title */}
                <h5 className="fw-bold mb-2" style={{ color: '#2d5a3d' }}>
                  {menu.title}
                </h5>

                {/* Description */}
                <p className="text-muted mb-3 small">
                  {menu.description}
                </p>

                {/* Action Button */}
                <button
                  className="btn btn-sm px-4"
                  style={{
                    background: menu.iconColor,
                    border: 'none',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}
                >
                  <i className="fas fa-arrow-right me-2"></i>
                  เปิดรายงาน
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNavigation activeTab="report" />
    </div>
  );
};

export default Reports;
