import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home';
import FarmerOrder from './Pages/FarmerOrder';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div className="container mt-10 mb-10">
        <div className="text-center mb-8">
        </div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/farmer-order" element={<FarmerOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
