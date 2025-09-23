import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { formatDate, formatDateForInput, formatDateForInputThai, convertBuddhistToGregorian } from '../utils/dateUtils';
import BottomNavigation from '../Components/BottomNavigation';
import AppHeader from '../Components/AppHeader';
import LIFFAuthGuard from '../Components/LIFFAuthGuard';


function ReportOrder() {
  const location = useLocation(); // Get the location object to access the URL query parameters
  const searchParams = new URLSearchParams(location.search); // Parse query parameters
  const farmName = searchParams.get('farmName'); // Extract the 'farmName' parameter

  // Get the start and end of the current week
  const getStartOfWeek = () => moment().startOf('isoWeek').toDate();
  const getEndOfWeek = () => moment().endOf('isoWeek').toDate();

  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDateForInput(getStartOfWeek())); // Start date for API calls
  const [endDate, setEndDate] = useState(formatDateForInput(getEndOfWeek())); // End date for API calls
  const [startDateDisplay, setStartDateDisplay] = useState(formatDateForInputThai(getStartOfWeek())); // Start date display in Thai
  const [endDateDisplay, setEndDateDisplay] = useState(formatDateForInputThai(getEndOfWeek())); // End date display in Thai
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_SHEET_API_KEY;

  // Sample data for demonstration
  const sampleData = [
    {
      'วันที่สั่งผัก': '2025-09-20',
      'ประเภทผัก': 'กะหล่ำปลี',
      'ยอดสั่งซื้อ': '150',
      'ยอดส่งจริง': '145'
    },
    {
      'วันที่สั่งผัก': '2025-09-21',
      'ประเภทผัก': 'มะเขือเทศ',
      'ยอดสั่งซื้อ': '200',
      'ยอดส่งจริง': '195'
    },
    {
      'วันที่สั่งผัก': '2025-09-22',
      'ประเภทผัก': 'แตงกวา',
      'ยอดสั่งซื้อ': '120',
      'ยอดส่งจริง': ''
    },
    {
      'วันที่สั่งผัก': '2025-09-23',
      'ประเภทผัก': 'ผักกาดขาว',
      'ยอดสั่งซื้อ': '80',
      'ยอดส่งจริง': '78'
    },
    {
      'วันที่สั่งผัก': '2025-09-24',
      'ประเภทผัก': 'หอมใหญ่',
      'ยอดสั่งซื้อ': '90',
      'ยอดส่งจริง': ''
    }
  ];

  // Fetch employee data when the component mounts
  useEffect(() => {
    // Set sample data on component mount
    setFilteredData(sampleData);
  }, []);

  const handleReportOrder = async () => {
    let params = "?action=farmer-order";
    // Convert Buddhist era dates back to Gregorian for API call
    params += `&startDate=${encodeURIComponent(convertBuddhistToGregorian(startDate).trim())}`;
    params += `&endDate=${encodeURIComponent(convertBuddhistToGregorian(endDate).trim())}`;
    params += `&farmName=${encodeURIComponent(farmName)}`; // Add the farmName parameter if it exists
    
    if(!!farmName)
    {
      const response = await fetch(`${apiKey}${params}`);
      const data = await response.json();
      return data; // Return the fetched data
    }
  };

  // Function to handle filtering
  const handleFilter = async () => {
    setLoading(true); // Set loading state to true before fetching data
    try {
      const result = await handleReportOrder();
      
      // Sort data by order date
      result.sort((a, b) => new Date(a['วันที่สั่งผัก']) - new Date(b['วันที่สั่งผัก']));
      setFilteredData(result);
    } finally {
      setLoading(false); // Set loading state to false after fetching data
    }
  };

  // Function to handle form reset
  const handleReset = () => {
    setStartDate(formatDateForInput(getStartOfWeek())); // Reset to the first day of the current week (Buddhist era)
    setEndDate(formatDateForInput(getEndOfWeek())); // Reset to the last day of the current week (Buddhist era)
    setFilteredData([]);
  };

  // Function to determine circle color
  const getCircleColor = (item) => {
    return item['ยอดส่งจริง'] !== "" ? 'bg-success' : 'bg-warning';
  };

  return (
      <LIFFAuthGuard>
      <div className="container-fluid px-2 px-md-3 pt-0 mt-2">
        {/* Header Section */}
        <AppHeader title="รายงาน"/>

        {farmName && (
        <div className="row mb-3">
          <div className="col-12 text-center">
            <h5 className="fw-bold" style={{ color: '#2d5a3d' }}>
              <i className="fas fa-seedling me-2"></i>
              ไร่ {farmName}
            </h5>
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
      
      <Modal show={loading} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
          <p>Loading...</p>
        </Modal.Body>
      </Modal>
      
      <div className="card border-2 shadow-sm" style={{
        borderColor: '#a8d5a3',
        borderRadius: '12px'
      }}>
        <div className="card-header" style={{ backgroundColor: '#f0f8ef' }}>
          <h6 className="mb-0 fw-bold" style={{ color: '#2d5a3d' }}>
            <i className="fas fa-table me-2"></i>
            ตารางรายงาน
          </h6>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead style={{ backgroundColor: '#e4f4e2' }}>
                <tr>
                  <th scope="col">วันที่สั่ง</th>
                  <th scope="col">ประเภทผัก</th>
                  <th scope="col" className="text-end">แผน</th>
                  <th scope="col" className="text-end">ส่งจริง</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        {formatDate(item['วันที่สั่งผัก'])}
                      </td>
                      <td>
                        {item['ประเภทผัก']}
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {item['ยอดสั่งซื้อ']}
                      </td>
                      <td className="text-end fw-bold text-success">
                        {item['ยอดส่งจริง'] || '-'}
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

      <BottomNavigation activeTab="report" />
      </div>
      </LIFFAuthGuard>
  );
}

export default ReportOrder;