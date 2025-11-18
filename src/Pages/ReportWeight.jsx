import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { formatDateShort, formatDateForInput, convertBuddhistToGregorian } from '../utils/dateUtils';
import BottomNavigation from '../Components/BottomNavigation';
import AppHeader from '../Components/AppHeader';
import axios from "axios";


function ReportWeight() {
  const location = useLocation(); // Get the location object to access the URL query parameters
  const searchParams = new URLSearchParams(location.search); // Parse query parameters

  // Get the start and end of the current month
  const getStartOfMonth = () => moment().startOf('month').toDate(); // ✅ แก้เป็น 'month'
  const getEndOfMonth = () => moment().endOf('month').toDate();     // ✅ แก้เป็น 'month'

  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDateForInput(getStartOfMonth())); // Start date for API calls
  const [endDate, setEndDate] = useState(formatDateForInput(getEndOfMonth())); // End date for API calls
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiUrl = import.meta.env.VITE_SHEET_FARM_API_KEY;

  const onGetReport = async () => { 
    try {
     
      // let farmCode = "2";
      // let userStatus = null;
      const profile = localStorage.getItem('profile') || null;
      console.log({profile})
      console.log({apiUrl})
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

      // ✅ แปลง Buddhist date string เป็น Gregorian date string ก่อนส่ง API
      const gregorianStartDate = convertBuddhistToGregorian(startDate);
      const gregorianEndDate = convertBuddhistToGregorian(endDate);
      const response = await axios.get(apiUrl, {
       params: {
        action: "get-farm-weight-report",
        farmCode: farmCode,
        startDate: gregorianStartDate, // ✅ ใช้ string ที่แปลงแล้ว
        endDate: gregorianEndDate,     // ✅ ใช้ string ที่แปลงแล้ว
      },
        timeout: 30000,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return []; // ✅ return empty array แทน null
    }
  };

  // Fetch employee data when the component mounts
  useEffect(() => {
    // Set sample data on component mount
    handleFilter();
  }, []);

  // Function to handle filtering
  const handleFilter = async () => {
    setLoading(true);
    try {
      let result = await onGetReport();
      
      if (result && result.length > 0) {
        result = result.map(item => ({
          deliveryDate: item['วันที่สั่ง'],
          vegetableType: item["ประเภทผัก"] || '',
          plannedQuantity: parseFloat(item["แผน"]) || 0,
          farmQuantity: item["ยอดชั่งหน้าสวน"] ? parseFloat(item["ยอดชั่งหน้าสวน"]) : null,
          actualQuantity: item["ส่งจริง"] ? parseFloat(item["ส่งจริง"]) : null
        }));

        // Sort โดยแปลง string date เป็น Date object ชั่วคราว
        result.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
        setFilteredData(result);
      } else {
        setFilteredData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form reset
  const handleReset = () => {
    setStartDate(formatDateForInput(getStartOfMonth())); // ✅ รีเซ็ตเป็นวันแรกของเดือน
    setEndDate(formatDateForInput(getEndOfMonth()));     // ✅ รีเซ็ตเป็นวันสุดท้ายของเดือน
    setFilteredData([]);
  };

  // Function to determine circle color
  const getCircleColor = (item) => {
    return item['ยอดส่งจริง'] !== "" ? 'bg-success' : 'bg-warning';
  };

  return (
      <div className="container-fluid px-2 px-md-3 pt-0 mt-2">
        {/* Header Section */}
        <AppHeader title="รายงานน้ำหนัก"/>
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
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#e4f4e2' }}>
                <tr>
                  <th scope="col">วันที่ส่ง</th>
                  <th scope="col">ผัก</th>
                  <th scope="col" className="text-end">แผน</th>
                  <th scope="col" className="text-end">หน้าสวน</th>
                  <th scope="col" className="text-end">ส่งจริง</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {formatDateShort(item.deliveryDate)}
                      </td>
                      <td>
                        {item.vegetableType}
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {item.plannedQuantity}
                      </td>
                       <td className="text-end fw-bold text-warning">
                        {item.farmQuantity || '-'}
                      </td>
                      <td className="text-end fw-bold text-success">
                        {item.actualQuantity || '-'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
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

      <BottomNavigation activeTab="report-weight" />
      </div>
  );
}

export default ReportWeight;