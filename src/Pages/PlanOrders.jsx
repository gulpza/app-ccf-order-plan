import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../Components/BottomNavigation';
import LIFFAuthGuard from '../Components/LIFFAuthGuard';
import AppHeader from '../Components/AppHeader';
import PlanOrderDetail from './PlanOrderDetail';
import { formatDate } from '../utils/dateUtils';
import { getHeaderBackgroundColor, getGradientBackground, getShadowColor } from '../config/statusColors';

const PlanOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
 
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedVegetableType, setSelectedVegetableType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด'); // เพิ่ม state สำหรับกรองสถานะ
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
      vegetableType: 'กะหล่ำปลีก',
      plannedQuantity: 150.20,
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

    // Filter by status - เพิ่มการกรองตามสถานะ
    if (selectedStatus && selectedStatus !== 'ทั้งหมด') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    setFilteredOrders(filtered);
  }, [orders, dateRange, selectedVegetableType, selectedStatus]);

  // Get unique vegetable types for dropdown
  const getVegetableTypes = () => {
    const types = [...new Set(orders.map(order => order.vegetableType))];
    return types.sort();
  };

  // Clear all filters
  const clearFilters = () => {
    setDateRange({ start: '', end: '' });
    setSelectedVegetableType('');
    setSelectedStatus(''); // เพิ่มการล้าง selectedStatus
    setShowDatePicker(false);
    setShowMobileFilters(false); // Hide mobile filters after clearing
  };

  // Handle status filter - ฟังก์ชันสำหรับจัดการการกรองสถานะ
  const handleStatusFilter = (status) => {
    if (selectedStatus === status) {
      // ถ้ากดสถานะเดิมซ้ำ ให้ยกเลิกการกรอง (แสดงทั้งหมด)
      setSelectedStatus('ทั้งหมด');
    } else {
      setSelectedStatus(status);
    }
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
      const updatedQuantity = actualQuantityInput ? parseFloat(actualQuantityInput) : null;
      const updatedOrders = orders.map(order => 
        order.id === selectedOrder.id 
          ? { 
              ...order, 
              actualQuantity: updatedQuantity,
              status: updatedQuantity ? 'ส่งแล้ว' : order.status // เปลี่ยนสถานะเป็น "ส่งแล้ว" เมื่อกรอกน้ำหนัก
            }
          : order
      );
      setOrders(updatedOrders);
      setShowOrderDetail(false);
      setSelectedOrder(null);
      setActualQuantityInput('');
    }
  };

  // Get statistics for summary display - แก้ไขให้คำนวณจาก orders แทน filteredOrders
  const getStatistics = () => {
    const pendingOrders = orders.filter(order => order.status === 'รอส่ง').length;
    const completedOrders = orders.filter(order => order.status === 'ส่งแล้ว').length;
    const cancelledOrders = orders.filter(order => order.status === 'ยกเลิก').length;
    
    return {
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalOrders: orders.length
    };
  };

  return (
    <LIFFAuthGuard>
      <div className="container-fluid px-2 px-md-3 pt-0 mt-2">
      {/* Header Section - Mobile Optimized */}
      <AppHeader title="แผนการส่งผัก" />

      {/* Mobile Summary Bar */}
      <div className="d-md-none mb-3 mt-2">
        <div className="row g-2">
          {/* ทั้งหมด */}
          <div className="col-3">
            <div 
              className={`card text-white cursor-pointer border border-2 ${
                selectedStatus === 'ทั้งหมด' 
                  ? 'border-dark shadow-lg' 
                  : 'border-secondary'
              }`}
              onClick={() => handleStatusFilter('ทั้งหมด')}
              style={{ 
                background: getGradientBackground('ทั้งหมด', selectedStatus === 'ทั้งหมด'),
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                transform: selectedStatus === 'ทั้งหมด' ? 'scale(1.05)' : 'scale(1)',
                borderRadius: '8px',
                boxShadow: selectedStatus === 'ทั้งหมด' 
                  ? `0 4px 12px ${getShadowColor('ทั้งหมด')}` 
                  : 'none'
              }}
            >
              <div className="card-body p-2 text-center">
                <div className="small mb-1" style={{
                  fontSize: '0.9rem', 
                  color: selectedStatus === 'ทั้งหมด' ? '#ffffff' : '#ffffff',
                  fontWeight: selectedStatus === 'ทั้งหมด' ? 'bold' : 'normal'
                }}>
                  {selectedStatus === 'ทั้งหมด' && <i className="fas fa-check-circle me-1"></i>}
                  ทั้งหมด
                </div>
                <div className="fw-bold pt-2" style={{
                  fontSize: selectedStatus === 'ทั้งหมด' ? '1.4rem' : '1.2rem', 
                  color: selectedStatus === 'ทั้งหมด' ? '#ffffff' : '#000000',
                  transition: 'all 0.3s ease',
                  transform: selectedStatus === 'ทั้งหมด' ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {getStatistics().totalOrders}
                </div>
              </div>
            </div>
          </div>

          {/* รอส่ง */}
          <div className="col-3">
            <div 
              className={`card text-white cursor-pointer border border-2 ${
                selectedStatus === 'รอส่ง' 
                  ? 'border-dark shadow-lg' 
                  : 'border-secondary'
              }`}
              onClick={() => handleStatusFilter('รอส่ง')}
              style={{ 
                background: getGradientBackground('รอส่ง', selectedStatus === 'รอส่ง'),
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                transform: selectedStatus === 'รอส่ง' ? 'scale(1.05)' : 'scale(1)',
                borderRadius: '8px',
                boxShadow: selectedStatus === 'รอส่ง' 
                  ? `0 4px 12px ${getShadowColor('รอส่ง')}` 
                  : 'none'
              }}
            >
              <div className="card-body p-2 text-center">
                <div className="small mb-1" style={{
                  fontSize: '0.9rem', 
                  color: selectedStatus === 'รอส่ง' ? '#ffffff' : '#ffffff',
                  fontWeight: selectedStatus === 'รอส่ง' ? 'bold' : 'normal'
                }}>
                  {selectedStatus === 'รอส่ง' && <i className="fas fa-check-circle me-1"></i>}
                  รอส่ง
                </div>
                <div className="fw-bold pt-2" style={{
                  fontSize: selectedStatus === 'รอส่ง' ? '1.4rem' : '1.2rem', 
                  color: selectedStatus === 'รอส่ง' ? '#ffffff' : '#000000',
                  transition: 'all 0.3s ease',
                  transform: selectedStatus === 'รอส่ง' ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {getStatistics().pendingOrders}
                </div>
              </div>
            </div>
          </div>
          
          {/* ส่งแล้ว */}
          <div className="col-3">
            <div 
              className={`card text-white cursor-pointer border border-2 ${
                selectedStatus === 'ส่งแล้ว' 
                  ? 'border-dark shadow-lg' 
                  : 'border-secondary'
              }`}
              onClick={() => handleStatusFilter('ส่งแล้ว')}
              style={{ 
                background: getGradientBackground('ส่งแล้ว', selectedStatus === 'ส่งแล้ว'),
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                transform: selectedStatus === 'ส่งแล้ว' ? 'scale(1.05)' : 'scale(1)',
                borderRadius: '8px',
                boxShadow: selectedStatus === 'ส่งแล้ว' 
                  ? `0 4px 12px ${getShadowColor('ส่งแล้ว')}` 
                  : 'none'
              }}
            >
              <div className="card-body p-2 text-center">
                <div className="small mb-1" style={{
                  fontSize: '0.9rem', 
                  color: selectedStatus === 'ส่งแล้ว' ? '#ffffff' : '#ffffff',
                  fontWeight: selectedStatus === 'ส่งแล้ว' ? 'bold' : 'normal'
                }}>
                  {selectedStatus === 'ส่งแล้ว' && <i className="fas fa-check-circle me-1"></i>}
                  ส่งแล้ว
                </div>
                <div className="fw-bold pt-2" style={{
                  fontSize: selectedStatus === 'ส่งแล้ว' ? '1.4rem' : '1.2rem', 
                  color: selectedStatus === 'ส่งแล้ว' ? '#ffffff' : '#000000',
                  transition: 'all 0.3s ease',
                  transform: selectedStatus === 'ส่งแล้ว' ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {getStatistics().completedOrders}
                </div>
              </div>
            </div>
          </div>
          
          {/* ยกเลิก */}
          <div className="col-3">
            <div 
              className={`card text-white cursor-pointer border border-2 ${
                selectedStatus === 'ยกเลิก' 
                  ? 'border-dark shadow-lg' 
                  : 'border-secondary'
              }`}
              onClick={() => handleStatusFilter('ยกเลิก')}
              style={{ 
                background: getGradientBackground('ยกเลิก', selectedStatus === 'ยกเลิก'),
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                transform: selectedStatus === 'ยกเลิก' ? 'scale(1.05)' : 'scale(1)',
                borderRadius: '8px',
                boxShadow: selectedStatus === 'ยกเลิก' 
                  ? `0 4px 12px ${getShadowColor('ยกเลิก')}` 
                  : 'none'
              }}
            >
              <div className="card-body p-2 text-center">
                <div className="small mb-1" style={{
                  fontSize: '0.9rem', 
                  color: selectedStatus === 'ยกเลิก' ? '#ffffff' : '#ffffff',
                  fontWeight: selectedStatus === 'ยกเลิก' ? 'bold' : 'normal'
                }}>
                  {selectedStatus === 'ยกเลิก' && <i className="fas fa-check-circle me-1"></i>}
                  ยกเลิก
                </div>
                <div className="fw-bold pt-2" style={{
                  fontSize: selectedStatus === 'ยกเลิก' ? '1.4rem' : '1.2rem', 
                  color: selectedStatus === 'ยกเลิก' ? '#ffffff' : '#000000',
                  transition: 'all 0.3s ease',
                  transform: selectedStatus === 'ยกเลิก' ? 'scale(1.1)' : 'scale(1)'
                }}>
                  {getStatistics().cancelledOrders}
                </div>
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
              onClick={(e) => {
                e.stopPropagation();
                handleOrderClick(order);
              }}
              style={{ 
                minHeight: '200px', 
                borderRadius: '12px',
                borderColor: '#dbdcdbff',
                borderWidth: '2px',
                borderStyle: 'solid'
              }}
            >
              {/* Header with date and vegetable type */}
              <div 
                className="card-header d-flex justify-content-between align-items-center p-2 border-0 position-relative" 
                style={{
                  background: getHeaderBackgroundColor(order.status),
                  borderRadius: '12px 12px 0 0',
                  minHeight: '40px'
                }}
              >
                {/* วันที่ส่ง - ด้านซ้าย */}
                <div className="flex-shrink-0">
                  <h6 className="mb-0 fw-bold ps-2 text-white " style={{fontSize: '1.2rem'}}>
                    {formatDate(order.deliveryDate)}
                  </h6>
                </div>
                
                {/* ประเภทผัก - ชิดขวา */}
                <div className="position-absolute end-0 top-50 translate-middle-y">
                  <h6 className="mb-0 fw-bold text-white text-end pe-3" style={{fontSize: '1.2rem'}}>
                    {order.vegetableType}
                  </h6>
                </div>
                
                {/* Spacer เพื่อให้สมดุล */}
                <div className="flex-shrink-0" style={{ width: '1rem' }}></div>
              </div>
              
              {/* Body with quantity data */}
              <div className="card-body p-2" style={{paddingTop: '0.75rem', background: '#ffffffff'}}>
                <div className="row text-center g-2">
                  <div className="col-6">
                    <div className="p-2 bg-light rounded">
                      <div className="text-muted small" style={{fontSize: '1.2rem'}}>แผน</div>
                      <div className="fw-bold text-primary" style={{fontSize: '1.5rem'}}>
                        {Number(order.plannedQuantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-2 bg-light rounded">
                      <div className="text-muted small" style={{fontSize: '1.2rem'}}>ส่งจริง</div>
                      <div className="fw-bold text-success" style={{fontSize: '1.5rem'}}>
                        {order.actualQuantity ? Number(order.actualQuantity).toFixed(2) : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with action button */}
              <div className="card-footer border-0 p-2" style={{
                background: '#f8f9faff',
                borderRadius: '0 0 12px 12px'
              }}>
                <button 
                  className="btn btn-sm w-100 fw-bold"
                  style={{
                    color: '#555555ff',
                    fontSize: '1.4rem',
                    // backgroundColor: '#2d5a3d'
                  }}
                >
                  <i className="fas fa-weight me-2 py-2"></i>
                  กดเพื่อกรอกน้ำหนัก
                </button>
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

      <BottomNavigation activeTab="plan" />
      </div>
    </LIFFAuthGuard>
  );
};

export default PlanOrders;