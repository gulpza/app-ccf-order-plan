import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';
import BottomNavigation from '../Components/BottomNavigation';
import LIFFAuthGuard from '../Components/LIFFAuthGuard';

// Function to format date to YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function ReportOrder() {
  const location = useLocation(); // Get the location object to access the URL query parameters
  const searchParams = new URLSearchParams(location.search); // Parse query parameters
  const farmName = searchParams.get('farmName'); // Extract the 'farmName' parameter

  // Get the start and end of the current week
  const getStartOfWeek = () => moment().startOf('isoWeek').toDate();
  const getEndOfWeek = () => moment().endOf('isoWeek').toDate();

  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(getStartOfWeek())); // Start date as the first day of the week
  const [endDate, setEndDate] = useState(formatDate(getEndOfWeek())); // End date as the last day of the week
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_SHEET_API_KEY;

  // Fetch employee data when the component mounts
  useEffect(() => {}, []);

  const handleReportOrder = async () => {
    let params = "?action=farmer-order";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
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
    setStartDate(formatDate(getStartOfWeek())); // Reset to the first day of the current week
    setEndDate(formatDate(getEndOfWeek())); // Reset to the last day of the current week
    setFilteredData([]);
  };

  // Function to determine circle color
  const getCircleColor = (item) => {
    return item['ยอดส่งจริง'] !== "" ? 'bg-success' : 'bg-warning';
  };

  return (
      <div className="container-fluid px-2 px-md-3">
        {/* Header Section */}
        <div className="row">
          <div className="col-12">
            <div className="text-center py-3 py-md-4">
              <h4 className="mb-0 fw-bold d-none d-md-block" style={{ color: '#2d5a3d' }}>
                <i className="fas fa-chart-bar me-2"></i>
                รายงาน
              </h4>
              <h5 className="mb-0 fw-bold d-md-none" style={{ color: '#2d5a3d' }}>
                <i className="fas fa-chart-bar me-2"></i>
                รายงาน
              </h5>
            </div>
          </div>
        </div>

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
                  <th scope="col" className="text-center">สถานะ</th>
                  <th scope="col">วันที่สั่ง</th>
                  <th scope="col">ประเภทผัก</th>
                  <th scope="col" className="text-end">แผน</th>
                  <th scope="col" className="text-end">ส่ง</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">
                        <div 
                          className={`rounded-circle d-inline-block ${getCircleColor(item)}`}
                          style={{ width: '12px', height: '12px' }}
                        ></div>
                      </td>
                      <td>
                        <i className="fas fa-calendar-alt me-2 text-muted"></i>
                        {moment(item['วันที่สั่งผัก']).format('DD/MM/YYYY')}
                      </td>
                      <td>
                        <i className="fas fa-seedling me-2 text-success"></i>
                        {item['ประเภทผัก']}
                      </td>
                      <td className="text-end fw-bold text-primary">
                        {item['ยอดสั่งซื้อ']} กก.
                      </td>
                      <td className="text-end fw-bold text-success">
                        {item['ยอดส่งจริง'] || '-'} {item['ยอดส่งจริง'] && 'กก.'}
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
  );
}

export default ReportOrder;