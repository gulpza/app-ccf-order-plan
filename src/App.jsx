import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import ReportOrder from './Pages/ReportOrder';
import PlanOrders from './Pages/PlanOrders';
import Profile from './Pages/Profile';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div className="container mt-10 mb-10">
        <div className="text-center mb-8">
        </div>
        <Routes>
          <Route path="/" element={<Navigate to="/plan/orders" replace />} />
          <Route path="/report/orders" element={<ReportOrder />} />
          <Route path="/plan/orders" element={<PlanOrders />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
