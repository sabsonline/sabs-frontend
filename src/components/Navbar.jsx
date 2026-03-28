import { useState, useEffect } from "react";
import { getCurrentUser, logoutUser } from "../services/api";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <a href="/" className="text-xl font-bold tracking-wide">📋 SABS Classifieds</a>
      <div className="flex items-center gap-4 text-sm">
        <a href="/" className="hover:underline">Home</a>
        <a href="/classifieds" className="hover:underline">Classifieds</a>

        {user ? (
          <>
            <span className="text-blue-200">👋 {user.name}</span>
            <a href="/post-ad"
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              + Post Ad
            </a>
            <button onClick={handleLogout}
              className="bg-blue-700 px-3 py-2 rounded-lg hover:bg-blue-800 transition">
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login" className="hover:underline">Login</a>
            <a href="/register"
              className="bg-white text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition">
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;