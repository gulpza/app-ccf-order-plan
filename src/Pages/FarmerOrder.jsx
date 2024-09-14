import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';
import Enum from '../Helpper/Enum';

// Function to format date to YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function FarmerOrder() {
  // Get the start and end of the current week
  const getStartOfWeek = () => moment().startOf('week').toDate();
  const getEndOfWeek = () => moment().endOf('week').toDate();

  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(getStartOfWeek())); // Start date as the first day of the week
  const [endDate, setEndDate] = useState(formatDate(getEndOfWeek())); // End date as the last day of the week
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_SHEET_API_KEY;

  // Fetch employee data when the component mounts
  useEffect(() => {}, []);

  const handleFarmerOrder = async () => {
    let params = "?action=farmer-order";
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
  
    const response = await fetch(`${apiKey}${params}`);
    const data = await response.json();
    return data; // Return the fetched data
  };

  // Function to handle filtering
  const handleFilter = async () => {
    setLoading(true); // Set loading state to true before fetching data
    try {
      const result = await handleFarmerOrder();
      
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
    <div className="container mt-4">
      <Link to="/home">
        <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
      </Link>
      <h2 className="text-center">ยอดจำนวนการสั่งซื้อและส่งจริงแต่ละสัปดาห์</h2>
      <div className="mb-6">
        <label htmlFor="startDate" className="form-label mt-3 me-3">วันที่เริ่ม:</label>
        <input
          type="date"
          id="startDate"
          className="form-control me-3"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="endDate" className="form-label mt-3 me-3">สิ้นสุด:</label>
        <input
          type="date"
          id="endDate"
          className="form-control me-3"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="btn btn-primary mt-3 mb-3 btn-lg btn-block me-3"
          onClick={handleFilter}
        >
          ค้นหา
        </button>
        <button className="btn btn-secondary mt-3 mb-3 ml-3 btn-lg btn-block" onClick={handleReset}>รีเซ็ต</button>
      </div>
      <Modal show={loading} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
          <p>Loading...</p>
        </Modal.Body>
      </Modal>
      <table className="table table-striped">
        <thead className="thead-light">
          <tr>
            <th scope="col"></th> {/* เพิ่มคอลัมน์ใหม่ */}
            <th scope="col">วันที่สั่งผัก</th>
            <th scope="col">ประเภทผัก</th>
            <th scope="col">ยอดสั่งซื้อ</th>
            <th scope="col">ยอดส่งจริง</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  <div className={`circle ${getCircleColor(item)}`}></div>
                </td>
                <td>{moment(item['วันที่สั่งผัก']).format('DD/MM/YYYY')}</td>
                <td>{item['ประเภทผัก']}</td>
                <td>{item['ยอดสั่งซื้อ']}</td>
                <td>{item['ยอดส่งจริง']}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FarmerOrder;