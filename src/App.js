import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Classifieds from "./pages/Classifieds";
import PostAd from "./pages/PostAd";
import AdDetail from "./pages/AdDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAds from "./pages/admin/AdminAds";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with Navbar */}
        <Route path="/" element={<><Navbar /><Home /></>} />
        <Route path="/classifieds" element={<><Navbar /><Classifieds /></>} />
        <Route path="/post-ad" element={<><Navbar /><PostAd /></>} />
        <Route path="/ad/:id" element={<><Navbar /><AdDetail /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />
        <Route path="/login" element={<><Navbar /><Login /></>} />

        {/* Admin routes - no Navbar */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/ads" element={<AdminAds />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;