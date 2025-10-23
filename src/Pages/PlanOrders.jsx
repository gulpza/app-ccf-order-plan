import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../Components/BottomNavigation';
import LIFFAuthGuard from '../Components/LIFFAuthGuard';
import AppHeader from '../Components/AppHeader';
import PlanOrderDetail from './PlanOrderDetail';
import { formatDate } from '../utils/dateUtils';
import { getHeaderBackgroundColor, getGradientBackground, getShadowColor } from '../config/statusColors';
import axios from "axios";

const PlanOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
 
  // Filter states
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedVegetableType, setSelectedVegetableType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ทั้งหมด'); // เพิ่ม state สำหรับกรองสถานะ
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [farmQuantityInput, setfarmQuantityInput] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const apiUrl = import.meta.env.VITE_SHEET_API_KEY; 

  // API function สำหรับอัปเดตน้ำหนักหน้าสวน
  const updateFarmOrderAPI = async (genId, farmQuantity) => {
    try {
    const response = await axios.post(apiUrl, new URLSearchParams({
      action: 'update-farm-order',
      GenId: genId,
      'ยอดชั่งหน้าสวน': farmQuantity.toString(),
      'สถานะการส่ง': 'ส่งแล้ว'
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
      console.error('❌ Error updating farm order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }; 

   const onGetOrders = async () => { 
    try {
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 7); // ย้อนหลัง 7 วัน
      
      const endDate = new Date(today);
      endDate.setFullYear(today.getFullYear() + 1); // บวก 1 ปี
      
      const profile = localStorage.getItem('profile');

      let farmCode = null;
      let userStatus = null;
      if (profile) {
        try {
          const profileData = JSON.parse(profile);
          farmCode = profileData.FarmCode || null;
          userStatus = profileData.Status || null;
        } catch (error) {
          console.error("Error parsing profile:", error);
        }
      }
      
      if (!farmCode || !userStatus || userStatus !== 'active') { 
        return null;
      }
      
      const response = await axios.get(apiUrl, {
       params: {
        action: "get-plan-farm-orders",
        farmCode: farmCode, // ใช้ farmCode จาก localStorage
        startDate: startDate.toISOString().split('T')[0], // YYYY-MM-DD format
        endDate: endDate.toISOString().split('T')[0], // YYYY-MM-DD format
      },
        timeout: 30000,
      });
      return response.data; // ✅ return data จริง
    } catch (error) {
      console.error("Error fetching orders:", error);
      return null;
    }
  };

  useEffect(() => {
    const transformApiData = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    
    return apiData.map(item => ({
      id: item.GenId,
      deliveryDate: item["วันที่สั่ง"],
      vegetableType: item["ประเภทผัก"] || '',
      remark: item["หมายเหตุ"] || '',
      plannedQuantity: parseFloat(item["แผน"]) || 0,
      farmQuantity: item["ยอดชั่งหน้าสวน"] ? parseFloat(item["ยอดชั่งหน้าสวน"]) : null,
      unit: 'กก.',
      status: item["สถานะการส่ง"] || '',
      farmCode: item["รหัสไร่"] || '',
      farmName: item["ชื่อไร่"] || ''
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await onGetOrders();

      if (data && Array.isArray(data)) {
        const transformedData = transformApiData(data);
        setOrders(transformedData);
        setFilteredOrders(transformedData);
      } else {
        // fallback ถ้า API ล้มเหลว ใช้ข้อมูลตัวอย่าง
        setOrders([]);
        setFilteredOrders([]);
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setLoading(false);
    }
  };

  fetchData();

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
    setfarmQuantityInput(order.farmQuantity ? order.farmQuantity.toString() : '');
    setShowOrderDetail(true);
  };

  // Update actual quantity
  const updatefarmQuantity = async () => {
    if (selectedOrder) {
      try {
        const updatedQuantity = farmQuantityInput ? parseFloat(farmQuantityInput) : null;
        
        if (!updatedQuantity) {
          alert('กรุณากรอกน้ำหนักที่ถูกต้อง');
          return;
        }
        
        // เรียก API เพื่อบันทึกข้อมูล
        const apiResult = await updateFarmOrderAPI(selectedOrder.id, updatedQuantity);
        
        if (!apiResult.success) {
          alert('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
          return;
        }
        
        // อัปเดต local state เมื่อ API สำเร็จ
        const updatedOrders = orders.map(order => {
          if (order.id === selectedOrder.id) {
            return {
              ...order,
              farmQuantity: updatedQuantity,
              status: 'ส่งแล้ว'
            };
          }
          return order;
        });
        
        setOrders(updatedOrders);
        setShowOrderDetail(false);
        setSelectedOrder(null);
        setfarmQuantityInput('');
    
      } catch (error) {
        console.error('Error updating quantity:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }
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

      {/* Loading State */}
      {loading && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: 'rgba(217, 215, 215, 0.6)',
            zIndex: 9999,
            backdropFilter: 'blur(2px)'
          }}
        >
          <div className="text-center bg-white rounded-3 shadow-lg p-4" style={{ minWidth: '200px' }}>
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">กำลังโหลด...</span>
            </div>
            <div className="text-muted fw-medium">กำลังโหลดข้อมูล...</div>
          </div>
        </div>
      )}

      {/* Mobile Summary Bar */}
      {(
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
      )}

      {/* Cards Grid */}
      {!loading && (
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
                    {order.remark === '' ? order.vegetableType : order.vegetableType + '+' + order.remark}
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
                      <div className="text-muted small" style={{fontSize: '1.2rem'}}>ชั่งหน้าสวน</div>
                      <div className="fw-bold text-success" style={{fontSize: '1.5rem'}}>
                        {order.farmQuantity ? Number(order.farmQuantity).toFixed(2) : '-'}
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
      )}

      {/* Empty States - Mobile Optimized */}
      {!loading && filteredOrders.length === 0 && orders.length > 0 && (
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

      {!loading && orders.length === 0 && (
        <div className="text-center mt-4 px-3">
          <i className="fas fa-exclamation-triangle fa-2x fa-md-3x text-muted mb-3"></i>
          <h5 className="text-muted h6 h-md-5">ไม่มีแผนส่งผัก</h5>
        </div>
      )}

      {/* Order Detail Modal Component */}
      {!loading && (
        <PlanOrderDetail
          showOrderDetail={showOrderDetail}
          selectedOrder={selectedOrder}
          farmQuantityInput={farmQuantityInput}
          setfarmQuantityInput={setfarmQuantityInput}
          updatefarmQuantity={updatefarmQuantity}
          setShowOrderDetail={setShowOrderDetail}
        />
      )}

      <BottomNavigation activeTab="plan" />
      </div>
    </LIFFAuthGuard>
  );
};

export default PlanOrders;