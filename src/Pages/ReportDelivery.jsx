import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { formatDateShort, formatDateForInput, convertBuddhistToGregorian } from '../utils/dateUtils';
import BottomNavigation from '../Components/BottomNavigation';
import AppHeader from '../Components/AppHeader';
import axios from "axios";


function ReportDelivery() {
  // Get the start and end of the current month
  const getStartOfMonth = () => moment().startOf('month').toDate(); // ✅ แก้เป็น 'month'
  const getEndOfMonth = () => moment().endOf('month').toDate();     // ✅ แก้เป็น 'month'

  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDateForInput(getStartOfMonth())); // Start date for API calls
  const [endDate, setEndDate] = useState(formatDateForInput(getEndOfMonth())); // End date for API calls
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiFarmUrl = import.meta.env.VITE_SHEET_FARM_API_KEY;
  const apiProductionUrl = import.meta.env.VITE_SHEET_PRODUCTION_API_KEY;
  const onGetReport = async () => { 
    try {
      // let farmCode = "2";
      // let userStatus = null;
      let farmCode = null;
      let userStatus = null;
      const profile = localStorage.getItem('profile') || null;
      if (profile) {
        try {
          const profileData = JSON.parse(profile);
          farmCode = profileData.FarmCode || null;
          userStatus = profileData.Status || null;
        } catch (error) {
           console.log({error})
           return null;
        }
      }

      if (!farmCode || !userStatus || userStatus !== 'active') {
        return null;
      }
      
      // แปลง Buddhist date string เป็น Gregorian date string ก่อนส่ง API
      const gregorianStartDate = convertBuddhistToGregorian(startDate);
      const gregorianEndDate = convertBuddhistToGregorian(endDate);
      const responseFarm = await axios.get(apiFarmUrl, {
        params: {
          action: "get-farm-weight-report",
          farmCode: farmCode,
          startDate: gregorianStartDate,
          endDate: gregorianEndDate,
        },
        timeout: 30000,
      });

     const responseProduction = await axios.get(apiProductionUrl, {
      params: {
        action: "get-fg-by-input-rawmat-code",
        inputRawmatCode: responseFarm.data.map(item => item['Code']).join(',')
      },
      timeout: 30000
    });
      
      const productionData = responseProduction.data || [];

      return {
        farmData: responseFarm.data,
        productionData: productionData
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return []; // ✅ return empty array แทน null
    }
  };

  useEffect(() => {
    // handleFilter();
  }, []);

  // Function to handle filtering
  const handleFilter = async () => {
    setLoading(true);
    try {
    
      let result = await onGetReport();
      if (result && result.farmData && result.productionData && result.farmData.length > 0) {
        // รวมข้อมูลจาก farmData และ productionData
        const combinedData = [];
        
        // สร้าง Map สำหรับ productionData เพื่อให้ค้นหาง่าย
        const productionMap = new Map();
        result.productionData.forEach(prod => {
          const key = `${prod['InputRawmatCode']}`;
          if (!productionMap.has(key)) {
            productionMap.set(key, []);
          }
          productionMap.get(key).push(prod);
        });
        // วนลูป farmData และจับคู่กับ productionData
        result.farmData.forEach(farm => {
          const key = `${farm['Code']}`;
          const productionItems = productionMap.get(key) || [{}];
          
          productionItems.forEach(prod => {
            combinedData.push({
              deliveryDateFarm: farm['วันที่สั่ง'] || '',
              vegetableType: farm['ประเภทผัก'] || '',
              vegetableWeight: farm['ส่งจริง'] || '',
              deliveryDateProduction: prod['วันที่ส่ง'] || '',
              deliveryLocation: prod['สถานที่ส่ง'] || '',
              quantity: prod['รวม'] || ''
            });
          });
        });
        
        // Sort by delivery date
        combinedData.sort((a, b) => {
          const dateA = new Date(a.deliveryDateFarm);
          const dateB = new Date(b.deliveryDateFarm);
          return dateA - dateB;
        });
        
        setFilteredData(combinedData);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form reset
  const handleReset = () => {
    setStartDate(formatDateForInput(getStartOfMonth()));
    setEndDate(formatDateForInput(getEndOfMonth()));
    setFilteredData([]);
  };

  return (
      <div className="container-fluid px-2 px-md-3 pt-0 mt-2">
        {/* Header Section */}
        <AppHeader title="รายงานส่งผัก"/>
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

      <div className="mb-6">
        <div className="card border-2 shadow-sm mb-4" style={{
          borderColor: '#a8d5a3',
          borderRadius: '12px'
        }}>
          <div className="card-header bg-light border-bottom">
            <h6 className="mb-0 text-dark">
              <i className="fas fa-filter me-2"></i>
              ตัวกรองข้อมูล
            </h6>
          </div>
          <div className="card-body p-3">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label htmlFor="startDate" className="form-label fw-bold">
                  <i className="fas fa-calendar-alt me-1 text-primary"></i>
                  วันที่เริ่ม:
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label htmlFor="endDate" className="form-label fw-bold">
                  <i className="fas fa-calendar-check me-1 text-primary"></i>
                  วันที่สิ้นสุด:
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
              <div className="col-12 col-md-4 d-flex align-items-end">
                <div className="w-100">
                  <button
                    className="btn btn-primary w-100 me-2 mb-2"
                    onClick={handleFilter}
                    style={{ backgroundColor: '#2d5a3d', borderColor: '#2d5a3d' }}
                  >
                    <i className="fas fa-search me-2"></i>
                    ค้นหา
                  </button>
                  <button 
                    className="btn btn-outline-secondary w-100" 
                    onClick={handleReset}
                  >
                    <i className="fas fa-redo me-2"></i>
                    รีเซ็ต
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card border-2 shadow-sm" style={{
        borderColor: '#a8d5a3',
        borderRadius: '12px'
      }}>
        <div className="card-header" style={{ backgroundColor: '#f0f8ef' }}>
          <h6 className="mb-0 fw-bold" style={{ color: '#2d5a3d' }}>
            <i className="fas fa-table me-2"></i>
            
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="table table-hover mb-0" style={{ minWidth: '650px' }}>
              <thead style={{ backgroundColor: '#e4f4e2' }}>
                <tr>
                  <th scope="col" style={{ width: '15%', minWidth: '85px' }}>วันที่สั่ง</th>
                  <th scope="col" style={{ width: '18%', minWidth: '95px' }}>ผัก</th>
                  <th scope="col" className="text-end" style={{ width: '13%', minWidth: '75px' }}>ส่งจริง</th>
                  <th scope="col" style={{ width: '15%', minWidth: '85px' }}>วันที่ส่ง</th>
                  <th scope="col" style={{ width: '28%', minWidth: '130px' }}>สถานที่ส่ง</th>
                  <th scope="col" className="text-end" style={{ width: '11%', minWidth: '65px' }}>รวม</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td style={{ width: '15%' }}>
                        {item.deliveryDateFarm ? formatDateShort(item.deliveryDateFarm) : '-'}
                      </td>
                      <td style={{ width: '18%' }}>
                        {item.vegetableType || '-'}
                      </td>
                      <td className="text-end fw-bold text-success" style={{ width: '13%' }}>
                        {item.vegetableWeight || '-'}
                      </td>
                      <td style={{ width: '15%' }}>
                        {item.deliveryDateProduction ? formatDateShort(item.deliveryDateProduction) : '-'}
                      </td>
                      <td style={{ width: '28%' }}>
                        {item.deliveryLocation || '-'}
                      </td>
                      <td className="text-end fw-bold text-primary" style={{ width: '11%' }}>
                        {item.quantity || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      <div className="text-muted">
                        <i className="fas fa-info-circle fa-2x mb-2 d-block"></i>
                        ไม่พบข้อมูลในช่วงวันที่ที่เลือก
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BottomNavigation activeTab="report-delivery" />
      </div>
  );
}

export default ReportDelivery;