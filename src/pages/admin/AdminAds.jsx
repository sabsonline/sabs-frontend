import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminAds, updateAdStatus, deleteAd } from "../../services/api";

function AdminAds() {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    if (!sessionStorage.getItem("adminToken")) {
      navigate("/admin");
      return;
    }
    fetchAds();
  }, [filter]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const data = await getAdminAds(filter);
      if (data.success) setAds(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const data = await updateAdStatus(id, status);
      if (data.success) {
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      }
    } catch (err) {
      alert("Failed to update status.");
    } finally {
      setActionLoading("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    setActionLoading(id);
    try {
      const data = await deleteAd(id);
      if (data.success) {
        setAds((prev) => prev.filter((ad) => ad._id !== id));
      }
    } catch (err) {
      alert("Failed to delete ad.");
    } finally {
      setActionLoading("");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Admin Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-bold">🛡️ Admin Panel</h1>
          <button onClick={() => navigate("/admin/dashboard")} className="text-sm text-gray-300 hover:text-white">Dashboard</button>
          <button onClick={() => navigate("/admin/ads")} className="text-sm text-white font-semibold border-b border-white">Manage Ads</button>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="text-sm text-gray-300 hover:text-white">View Site</button>
          <button
            onClick={() => { sessionStorage.removeItem("adminToken"); navigate("/admin"); }}
            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Ads</h2>
          <span className="text-gray-400 text-sm">{ads.length} ads found</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["pending", "approved", "rejected", ""].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === s
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-400">⏳ Loading ads...</p>
          </div>
        )}

        {/* No Ads */}
        {!loading && ads.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-400">No {filter || ""} ads found.</p>
          </div>
        )}

        {/* Ads Table */}
        {!loading && ads.length > 0 && (
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-4 py-3 text-left">Ad Details</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ads.map((ad) => (
                  <tr key={ad._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 truncate max-w-xs">{ad.title}</p>
                      <p className="text-xs text-gray-400 truncate max-w-xs">{ad.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ad.category}</td>
                    <td className="px-4 py-3 text-blue-600 font-medium">
                      {ad.price === 0 ? "Free" : `AED ${ad.price}`}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{ad.location}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ad.status]}`}>
                        {ad.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {ad.status !== "approved" && (
                          <button
                            onClick={() => handleStatus(ad._id, "approved")}
                            disabled={actionLoading === ad._id}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 disabled:opacity-50"
                          >
                            ✅
                          </button>
                        )}
                        {ad.status !== "rejected" && (
                          <button
                            onClick={() => handleStatus(ad._id, "rejected")}
                            disabled={actionLoading === ad._id}
                            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600 disabled:opacity-50"
                          >
                            ❌
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(ad._id)}
                          disabled={actionLoading === ad._id}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAds;