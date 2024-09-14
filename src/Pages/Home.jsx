import React from 'react';
import { Link } from 'react-router-dom';
import Enum from '../Helpper/Enum';

const Home = () => {
  return (
    <div className="container">
      <Link >
          <img src={Enum.URL_LOGO} alt="Company Logo" className="img-fluid" style={{ maxWidth: '150px' }} />
        </Link>
      <h2 className="text-center mb-4">บริษัท ชัยเจริญเฟรช จำกัด</h2>
      <div className="row">
        <div className="col-md-12">
          <Link to="/farmer-order" className="card text-center">
            <div className="card-body">
              <i className="fas fa-bullhorn fa-3x mb-3"></i>
              <h5 className="card-title">ยอดจำนวนการสั่งซื้อและส่งจริงแต่ละสัปดาห์</h5>
            </div>
          </Link>
        </div>
       
      </div>
    </div>
  );
};

export default Home;
