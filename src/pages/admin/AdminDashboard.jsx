import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getAdminAds } from "../../services/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentAds, setRecentAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }
    const fetchData = async () => {
      try {
        const [statsData, adsData] = await Promise.all([
          getAdminStats(),
          getAdminAds("pending"),
        ]);
        if (statsData.success) setStats(statsData.data);
        if (adsData.success) setRecentAds(adsData.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">⏳ Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold">🛡️ Admin Panel</h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-sm text-gray-300 hover:text-white"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/ads")}
            className="text-sm text-gray-300 hover:text-white"
          >
            Manage Ads
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-300 hover:text-white"
          >
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Ads", value: stats.total, color: "bg-blue-500", icon: "📋" },
            { label: "Pending", value: stats.pending, color: "bg-yellow-500", icon: "⏳" },
            { label: "Approved", value: stats.approved, color: "bg-green-500", icon: "✅" },
            { label: "Rejected", value: stats.rejected, color: "bg-red-500", icon: "❌" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
              <div className={`${stat.color} text-white text-2xl w-12 h-12 rounded-xl flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pending Ads Quick View */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">⏳ Pending Approval</h3>
            <button
              onClick={() => navigate("/admin/ads")}
              className="text-blue-600 text-sm hover:underline"
            >
              View All →
            </button>
          </div>

          {recentAds.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              🎉 No pending ads — all caught up!
            </p>
          ) : (
            <div className="divide-y">
              {recentAds.map((ad) => (
                <div key={ad._id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{ad.title}</p>
                    <p className="text-xs text-gray-400">{ad.category} • {ad.location}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 font-medium">
                      AED {ad.price || "Free"}
                    </span>
                    <button
                      onClick={() => navigate("/admin/ads")}
                      className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;