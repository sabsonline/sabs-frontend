import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAdById } from "../services/api";
import categories from "../data/categories";

function AdDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const data = await getAdById(id);
        if (data.success) {
          setAd(data.data);
        } else {
          setError("Ad not found.");
        }
      } catch (err) {
        setError("Cannot connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-lg">⏳ Loading...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );

  const icon = categories.find(c => c.name === ad.category)?.icon || "📋";

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 text-sm mb-4 hover:underline flex items-center gap-1"
        >
          ← Back to Listings
        </button>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {ad.image ? (
  <img
    src={ad.image}
    alt={ad.title}
    className="w-full h-56 object-cover"
  />
) : (
  <div className="bg-blue-50 h-56 flex items-center justify-center text-8xl">
    {icon}
  </div>
)}
          <div className="p-6">
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
              {ad.category}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{ad.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{ad.description}</p>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 mb-6">
              <div>
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-blue-600 font-bold text-lg">
                  {ad.price === 0 ? "Free" : `AED ${ad.price.toLocaleString()}`}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Location</p>
                <p className="text-gray-700 font-medium">📍 {ad.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Posted On</p>
                <p className="text-gray-700 font-medium">
                  🗓️ {new Date(ad.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Status</p>
                <p className="text-yellow-600 font-medium">🕐 {ad.status}</p>
              </div>
            </div>
            <div className="flex gap-3">
  
    <a href={`tel:${ad.posterPhone}`}
    className={`flex-1 text-center bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition ${!ad.posterPhone && "opacity-50 pointer-events-none"}`}
  >
    📞 Call Seller
  </a>
  
   <a href={`https://wa.me/${ad.posterWhatsapp?.replace(/[^0-9]/g, "")}`}
    target="_blank"
    rel="noreferrer"
    className={`flex-1 text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition ${!ad.posterWhatsapp && "opacity-50 pointer-events-none"}`}
  >
    💬 WhatsApp
  </a>
  
    <a href={`mailto:${ad.posterEmail}`}
    className={`flex-1 text-center bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition ${!ad.posterEmail && "opacity-50 pointer-events-none"}`}
  >
    ✉️ Email
  </a>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdDetail;