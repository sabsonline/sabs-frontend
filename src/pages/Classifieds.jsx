import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAds } from "../services/api";
import categories from "../data/categories";

function Classifieds() {
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch ads from backend whenever filters change
  useEffect(() => {
    const fetchAds = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAds({
          search: searchText,
          category: selectedCategory,
          sort: sortBy,
        });
        if (data.success) {
          setAds(data.data);
        } else {
          setError("Failed to load ads.");
        }
      } catch (err) {
        setError("Cannot connect to server. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    // Small delay so we don't call API on every single keypress
    const timer = setTimeout(fetchAds, 400);
    return () => clearTimeout(timer);
  }, [searchText, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">All Listings</h2>
            <p className="text-gray-400 text-sm">{ads.length} ads found</p>
          </div>
          
          <a  href="/post-ad"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            + Post Ad
          </a>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search ads..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
          {(searchText || selectedCategory) && (
            <button
              onClick={() => { setSearchText(""); setSelectedCategory(""); }}
              className="text-sm text-red-500 hover:underline whitespace-nowrap"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">⏳</p>
            <p className="text-gray-400">Loading ads...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && ads.length === 0 && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-500 font-medium">No ads found.</p>
            <a href="/post-ad" className="mt-3 text-blue-600 text-sm hover:underline block">
              Be the first to post an ad!
            </a>
          </div>
        )}

        {/* Ad Cards Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {ads.map((ad) => (
              <div
                key={ad._id}
                onClick={() => navigate(`/ad/${ad._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden"
              >
                {ad.image ? (
  <img
    src={`http://localhost:5000${ad.image}`}
    alt={ad.title}
    className="w-full h-40 object-cover"
  />
) : (
  <div className="bg-blue-50 h-40 flex items-center justify-center text-6xl">
    {categories.find(c => c.name === ad.category)?.icon || "📋"}
  </div>
)}
                <div className="p-4">
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                    {ad.category}
                  </span>
                  <h3 className="text-gray-800 font-semibold mt-2 mb-1 truncate">{ad.title}</h3>
                  <p className="text-gray-400 text-xs truncate mb-3">{ad.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold text-sm">
                      {ad.price === 0 ? "Free" : `AED ${ad.price.toLocaleString()}`}
                    </span>
                    <span className="text-gray-400 text-xs">📍 {ad.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Classifieds;