import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLIFF } from '../hooks/useLIFF';
import BottomNavigation from '../Components/BottomNavigation';
import LIFFAuthGuard from '../Components/LIFFAuthGuard';
import PlanOrderDetail from './PlanOrderDetail';

const PlanOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // LINE LIFF Integration
  const { 
    isReady: liffReady, 
    isLoggedIn, 
    userProfile, 
    isInLineClient,
    shareOrder,
    sendMessage,
    closeWindow
  } = useLIFF();
  
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedVegetableType, setSelectedVegetableType] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [actualQuantityInput, setActualQuantityInput] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sample order data - in a real app, this would come from an API
  const sampleOrders = [
    {
      id: 1,
      deliveryDate: '2025-09-22',
      vegetableType: 'กะหล่ำปลี',
      plannedQuantity: 150,
      actualQuantity: null,
      unit: 'กก.',
      status: 'รอส่ง'
    },
    {
      id: 2,
      deliveryDate: '2025-09-22',
      vegetableType: 'มะเขือเทศ',
      plannedQuantity: 200,
      actualQuantity: 195,
      unit: 'กก.',
      status: 'ส่งแล้ว'
    },
    {
      id: 3,
      deliveryDate: '2025-09-23',
      vegetableType: 'แตงกวา',
      plannedQuantity: 120,
      actualQuantity: null,
      unit: 'กก.',
      status: 'รอส่ง'
    },
    {
      id: 4,
      deliveryDate: '2025-09-23',
      vegetableType: 'ผักกาดขาว',
      plannedQuantity: 80,
      actualQuantity: null,
      unit: 'กก.',
      status: 'ยกเลิก'
    },
    {
      id: 5,
      deliveryDate: '2025-09-24',
      vegetableType: 'หอมใหญ่',
      plannedQuantity: 90,
      actualQuantity: 88,
      unit: 'กก.',
      status: 'รอส่ง'
    },
    {
      id: 6,
      deliveryDate: '2025-09-24',
      vegetableType: 'มันฝรั่ง',
      plannedQuantity: 180,
      actualQuantity: 175,
      unit: 'กก.',
      status: 'ส่งแล้ว'
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setOrders(sampleOrders);
    setFilteredOrders(sampleOrders);
  }, []);

  // Filter function
  useEffect(() => {
    let filtered = [...orders];

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter(order => order.deliveryDate >= dateRange.start);
    }
    if (dateRange.end) {
      filtered = filtered.filter(order => order.deliveryDate <= dateRange.end);
    }

    // Filter by vegetable type
    if (selectedVegetableType) {
      filtered = filtered.filter(order => order.vegetableType === selectedVegetableType);
    }

    setFilteredOrders(filtered);
  }, [orders, dateRange, selectedVegetableType]);

  // Get unique vegetable types for dropdown
  const getVegetableTypes = () => {
    const types = [...new Set(orders.map(order => order.vegetableType))];
    return types.sort();
  };

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedVegetableType('');
    setShowDatePicker(false);
    setShowMobileFilters(false); // Hide mobile filters after clearing
  };

  // Handle order click
  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setActualQuantityInput(order.actualQuantity ? order.actualQuantity.toString() : '');
    setShowOrderDetail(true);
  };

  // Update actual quantity
  const updateActualQuantity = () => {
    if (selectedOrder) {
      const updatedQuantity = actualQuantityInput ? parseInt(actualQuantityInput) : null;
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { ...order, actualQuantity: updatedQuantity }
          : order
      );
      setOrders(updatedOrders);
      setShowOrderDetail(false);
      setSelectedOrder(null);
      setActualQuantityInput('');
    }
  };



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = (date.getFullYear() + 543); // Convert to Buddhist era
    return `${day}/${month}/${year}`;
  };

  const getVegetableIcon = (vegetableType) => {
    // Return appropriate icon based on vegetable type
    const iconMap = {
      'กะหล่ำปลี': 'fas fa-leaf',
      'มะเขือเทศ': 'fas fa-circle',
      'แตงกวา': 'fas fa-seedling',
      'ผักกาดขาว': 'fas fa-leaf',
      'หอมใหญ่': 'fas fa-circle',
      'มันฝรั่ง': 'fas fa-square'
    };
    return iconMap[vegetableType] || 'fas fa-seedling';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'รอส่ง': {
        class: 'badge rounded-pill px-3 py-1',
        style: { backgroundColor: '#eada71ff', color: 'white', fontWeight: '600', fontSize: '0.9rem' },
        icon: 'fas fa-clock',
      },
      'ส่งแล้ว': {
        class: 'badge rounded-pill px-3 py-1',
        style: { backgroundColor: '#4caf50', color: 'white', fontWeight: '600', fontSize: '0.9rem' },
        icon: 'fas fa-check-circle',
      },
      'ยกเลิก': {
        class: 'badge rounded-pill px-3 py-1',
        style: { backgroundColor: '#ef5350', color: 'white', fontWeight: '600', fontSize: '0.9rem' },
        icon: 'fas fa-times-circle',
      }
    };
    
    const config = statusConfig[status] || statusConfig['รอส่ง'];
    return (
      <span className={config.class} style={config.style}>
        <i className={`${config.icon} me-1`} style={{ fontSize: '0.7rem' }}></i>
        {status}
      </span>
    );
  };

  // Get statistics for summary display
  const getStatistics = () => {
    const pendingOrders = filteredOrders.filter(order => order.status === 'รอส่ง').length;
    const completedOrders = filteredOrders.filter(order => order.status === 'ส่งแล้ว').length;
    const cancelledOrders = filteredOrders.filter(order => order.status === 'ยกเลิก').length;
    
    return {
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalOrders: filteredOrders.length
    };
  };

  // Export orders to CSV
  const exportToCSV = () => {
    const headers = ['วันที่ส่ง', 'ชื่อผัก', 'จำนวน (กิโลกรัม)', 'ราคาต่อกิโลกรัม', 'ราคารวม', 'สถานะ', 'จำนวนส่งจริง'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        formatDate(order.deliveryDate),
        order.vegetableName,
        order.quantity,
        order.pricePerKg,
        order.totalPrice,
        order.status,
        order.actualQuantity || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vegetable-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // LIFF Share Order Function
  const handleShareOrder = async (order) => {
    try {
      const success = await shareOrder(order);
      if (success) {
        console.log('✅ Order shared successfully');
      }
    } catch (error) {
      console.error('❌ Failed to share order:', error);
      // Fallback to regular share if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: `แผนการส่งผัก - ${order.vegetableName}`,
            text: `🥬 ${order.vegetableName} ${order.quantity}กก. วันที่: ${formatDate(order.deliveryDate)} สถานะ: ${order.status}`,
            url: window.location.href
          });
        } catch (shareError) {
          console.error('❌ Native share also failed:', shareError);
        }
      }
    }
  };

  // LIFF Send Summary Message
  const handleSendSummary = async () => {
    try {
      const stats = getStatistics();
      const message = `📊 สรุปแผนการส่งผักก\n\n` +
        `📦 ทั้งหมด: ${stats.totalOrders} รายการ\n` +
        `⏳ รอส่ง: ${stats.pendingOrders} รายการ\n` +
        `✅ ส่งแล้ว: ${stats.completedOrders} รายการ\n` +
        `❌ ยกเลิก: ${stats.cancelledOrders} รายการ\n\n` +
        `🌱 ฟาร์มจระเข้ - ${new Date().toLocaleDateString('th-TH')}`;
        
      await sendMessage(message);
      console.log('✅ Summary sent successfully');
    } catch (error) {
      console.error('❌ Failed to send summary:', error);
    }
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <LIFFAuthGuard>
      <div className="container-fluid px-2 px-md-3">
      {/* LIFF Header */}
      {/* <LIFFHeader /> */}
      {/* Header Section - Mobile Optimized */}
      <div className="row">
        <div className="col-12">
          <div className="text-center py-3 py-md-4">
            <div className="mb-2">
              <div className="d-inline-flex align-items-center justify-content-center">
                <i className="fas fa-leaf me-2" style={{ fontSize: '2rem', color: '#2d5a3d' }}></i>
                <div className="text-start">
                  <h4 className="mb-0 fw-bold d-none d-md-block" style={{ color: '#2d5a3d' }}>ฟาร์มจระเข้</h4>
                  <h5 className="mb-0 fw-bold d-md-none" style={{ color: '#2d5a3d' }}>ฟาร์มจระเข้</h5>
                </div>
              </div>
            </div>
            <h5 className="mb-0 d-none d-md-block" style={{ color: '#6cb866' }}>
              <i className="fas fa-shopping-cart me-2"></i>
              แผนการส่งผัก
            </h5>
            <h6 className="mb-0 d-md-none" style={{ color: '#6cb866' }}>
              <i className="fas fa-shopping-cart me-1"></i>
              แผนการส่งผัก
            </h6>
          </div>
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="row mb-3 d-md-none">
        <div className="col-12">
          <button 
            className="btn w-100 py-2 border-2"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            style={{
              borderRadius: '12px', 
              fontSize: '0.95rem',
              background: 'linear-gradient(135deg, #f0f8ef, #ffffff)',
              border: '2px solid #a8d5a3',
              color: '#2d5a3d'
            }}
          >
            <i className={`fas ${showMobileFilters ? 'fa-chevron-up' : 'fa-filter'} me-2`}></i>
            {showMobileFilters ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
            {(dateRange.start || dateRange.end || selectedVegetableType) && (
              <span className="badge ms-2 px-2" style={{background: '#2d5a3d', color: 'white'}}>
                {[dateRange.start, dateRange.end, selectedVegetableType].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter Section - Desktop always visible, Mobile collapsible */}
      <div className={`row mb-4 ${showMobileFilters ? 'd-block' : 'd-none d-md-block'}`}>
        <div className="col-12">
          <div className="card filter-card border-0 shadow-sm">
            <div className="card-header bg-light border-bottom d-none d-md-block">
              <h6 className="mb-0 text-dark">
                <i className="fas fa-filter me-2"></i>
                ตัวกรองข้อมูล
              </h6>
            </div>
            <div className="card-body p-2 p-md-3">
              {/* Date Range Row - Mobile: Stack vertically, Desktop: Side by side */}
              <div className="row g-2 g-md-3">
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold small">
                    <i className="fas fa-calendar-day me-1 text-primary"></i>
                    วันที่เริ่มต้น:
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    placeholder="เลือกวันที่เริ่มต้น"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold small">
                    <i className="fas fa-calendar-check me-1 text-primary"></i>
                    วันที่สิ้นสุด:
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    placeholder="เลือกวันที่สิ้นสุด"
                    min={dateRange.start}
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label fw-bold small">
                    <i className="fas fa-seedling me-1 text-success"></i>
                    ประเภทผัก:
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedVegetableType}
                    onChange={(e) => setSelectedVegetableType(e.target.value)}
                  >
                    <option value="">ทุกประเภท</option>
                    {getVegetableTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button Row */}
              <div className="row g-2 mt-3">
                <div className="col-12 text-center">
                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => {
                      // The filtering is already applied through useEffect
                      // This button provides visual feedback for search action
                    }}
                  >
                    <i className="fas fa-search me-2"></i>
                    ค้นหา
                  </button>
          
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Summary Bar */}
      <div className="d-md-none mb-3">
        <div className="card text-white" style={{ background: '#12a308ff' }}>
          <div className="card-body p-2">
            <div className="row text-center">
              <div className="col-3">
                <div className="small">ทั้งหมด</div>
                <div className="fw-bold">{filteredOrders.length}</div>
              </div>
              <div className="col-3">
                <div className="small">รอส่ง</div>
                <div className="fw-bold" >{getStatistics().pendingOrders}</div>
              </div>
              <div className="col-3">
                <div className="small" >ส่งแล้ว</div>
                <div className="fw-bold" >{getStatistics().completedOrders}</div>
              </div>
              <div className="col-3">
                <div className="small">ยกเลิก</div>
                <div className="fw-bold">{getStatistics().cancelledOrders}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="row g-2 g-md-3">
        {filteredOrders.map((order) => (
          <div key={order.id} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-2 mb-md-3">
            <div 
              className="card h-100 compact-order-card shadow-sm border-2"
              onClick={() => handleOrderClick(order)}
              style={{ 
                cursor: 'pointer', 
                minHeight: '140px', 
                borderRadius: '12px',
                borderColor: '#a8d5a3',
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              {/* Header with vegetable name and status */}
              <div 
                className="card-header d-flex justify-content-between align-items-center p-2 border-0" 
                style={{
                  background: '#e4f4e2ff',
                  borderRadius: '12px 12px 0 0',
                  minHeight: '50px'
                }}
              >
                <div className="d-flex align-items-center flex-grow-1">
            
                  <h6 className="mb-0 fw-bold text-dark text-truncate" style={{fontSize: '1rem'}}>
                    {formatDate(order.deliveryDate)}
                  </h6>
                </div>
                <div className="ms-2" >
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              {/* Body with date and quantity - Mobile optimized */}
              <div className="card-body p-3" style={{paddingTop: '0.75rem', background: '#ffffffff', borderRadius: '0 0 12px 12px'}}>
                <div className="row text-center g-2">
                  <div className="col-12 mb-2">
                    <div className="fw-bold text-dark" style={{fontSize: '1.2rem'}}>
             
                      {order.vegetableType}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded">
                      <div className="text-muted small"  style={{fontSize: '1.2rem'}}>แผน</div>
                      <div className="fw-bold text-primary" style={{fontSize: '1.2rem'}}>
                        {order.plannedQuantity.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded">
                      <div className="text-muted small"  style={{fontSize: '1.2rem'}}>ส่งจริง</div>
                      <div className="fw-bold text-success" style={{fontSize: '1.2rem'}}>
                        {order.actualQuantity ? order.actualQuantity.toLocaleString() : '-'}
                      </div>
                    </div>
                  </div>
                </div>
            
              </div>

              
            </div>
          </div>
        ))}
      </div>

      {/* Empty States - Mobile Optimized */}
      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="text-center mt-4 px-3">
          <i className="fas fa-search fa-2x fa-md-3x text-muted mb-3"></i>
          <h5 className="text-muted h6 h-md-5">ไม่พบข้อมูลที่ตรงกับการค้นหา</h5>
          <p className="text-muted small">ลองปรับเปลี่ยนเงื่อนไขการกรองข้อมูล</p>
          <button className="btn btn-outline-primary btn-sm" onClick={clearFilters}>
            <i className="fas fa-times me-1"></i>
            ล้างตัวกรอง
          </button>
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center mt-4 px-3">
          <i className="fas fa-exclamation-triangle fa-2x fa-md-3x text-muted mb-3"></i>
          <h5 className="text-muted h6 h-md-5">ไม่มีข้อมูลการสั่งซื้อ</h5>
          <p className="text-muted small">กรุณาเพิ่มข้อมูลการสั่งซื้อผัก</p>
        </div>
      )}

      {/* Order Detail Modal Component */}
      <PlanOrderDetail
        showOrderDetail={showOrderDetail}
        selectedOrder={selectedOrder}
        actualQuantityInput={actualQuantityInput}
        setActualQuantityInput={setActualQuantityInput}
        updateActualQuantity={updateActualQuantity}
        setShowOrderDetail={setShowOrderDetail}
      />

      {filteredOrders.length === 0 && orders.length > 0 && (
        <div className="text-center mt-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">ไม่พบข้อมูลที่ตรงกับการค้นหา</h4>
          <p className="text-muted">ลองปรับเปลี่ยนเงื่อนไขการกรองข้อมูล</p>
  
        </div>
      )}

      {orders.length === 0 && (
        <div className="text-center mt-5">
          <i className="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
          <h4 className="text-muted">ไม่มีข้อมูลการสั่งซื้อ</h4>
          <p className="text-muted">กรุณาเพิ่มข้อมูลการสั่งซื้อผัก</p>
        </div>
      )}

      <BottomNavigation activeTab="plan" />
     
      </div>
    </LIFFAuthGuard>
  );
};

export default PlanOrders;