import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Spinner } from 'react-bootstrap';
import moment from 'moment';
import Enum from '../Helpper/Enum';

function formatDate(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function PickDailyMemberRecord() {
  const [filteredData, setFilteredData] = useState([]);
  const [empId, setEmpId] = useState('');
  const [employees, setEmployees] = useState([]);
  const [startDate, setStartDate] = useState(formatDate(new Date())); // Start date default to today
  const [endDate, setEndDate] = useState(formatDate(new Date())); // End date default to today
  const [loading, setLoading] = useState(false); // State variable for loading indicator
  const apiKey = import.meta.env.VITE_SHEET_PICK_API_KEY;

  // Fetch employee data when the component mounts
  useEffect(() => {
    handleMember();
  }, []);

  const handleMember = () => { 
    setLoading(true);
    fetch(`${apiKey}?action=member`)
      .then(response => response.json())
      .then(data => {
        const sortedData = data.sort((a, b) => a['รหัสพนักงาน'].toUpperCase() - b['รหัสพนักงาน'].toUpperCase());
        setEmployees(sortedData);
      })
      .catch(error => {
        console.error('Error fetching employee data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Function to handle filtering
  const handleFilter = () => {
    setLoading(true); // Set loading state to true before fetching data

    // Construct the API URL with parameters
    let params = "?action=pickrecord";
    params += `&empId=${encodeURIComponent(empId.trim().toUpperCase())}`;
    params += `&startDate=${encodeURIComponent(startDate.trim())}`;
    params += `&endDate=${encodeURIComponent(endDate.trim())}`;
  
    // Make a fetch request to the API
    fetch(`${apiKey}${params}`)
      .then(response => response.json())
      .then(data => {
        const reduceData = data.reduce((acc, item) => {
          const { วันที่เด็ด, ประเภทผัก, น้ำหนัก } = item;
          const key = `${วันที่เด็ด}_${ประเภทผัก}`;
          
          if (!acc[key]) {
              acc[key] = {
                  วันที่เด็ด,
                  ประเภทผัก,
                  totalWeight: 0
              };
          }
          
          acc[key].totalWeight += น้ำหนัก;
          
          return acc;
      }, {});

        data = Object.values(reduceData);
        
        let result = data.map((e, i) => {
          return {
            date: e['วันที่เด็ด'],
            vegetable: e['ประเภทผัก'],
            totalWeight: e.totalWeight.toFixed(2)
          }
        });

        result.sort((a, b) => new Date(a.date) - new Date(b.date));

        setFilteredData(result);

      })
      .catch(error => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false); // Set loading state to false after fetching data
      });
  };

  // Function to handle form reset
  const handleReset = () => {
    setEmpId('');
    setFilterDate(formatDate(new Date()));
    setFilteredData([]);
  };

  return (
    <div className="container mt-4">
       <Link  to="/home" >
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
       <h2 className="text-center">รายงานจำนวนการเด็ด</h2>
      <div className="mb-6">
        <label htmlFor="empId" className="form-label">พนักงาน:</label>
        <select
          id="empId"
          className="form-select"
          value={empId}
          required
          onChange={(e) => setEmpId(e.target.value)}
        >
          <option value="">เลือกพนักงาน</option>
          {employees.map((employee) => (
            <option key={employee['รหัสพนักงาน']} value={employee['รหัสพนักงาน']}>
              {employee['ชื่อพนักงาน']} {employee['นามสกุล']} {employee['รหัสพนักงาน']}  {'('}{employee['ชื่อเล่น'] || ''}{')'}
            </option>
          ))}
        </select>
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
          disabled={!empId || !startDate || !endDate}
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
            <th scope="col">วันที่</th>
            <th scope="col">ประเภทผัก</th>
            <th scope="col">น้ำหนัก</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index}>
                <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                <td>{item.vegetable}</td>
                <td>{item.totalWeight}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PickDailyMemberRecord;
