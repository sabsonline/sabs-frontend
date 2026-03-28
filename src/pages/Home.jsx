import { useNavigate } from "react-router-dom";
import categories from "../data/categories";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Browse Categories</h2>
        <p className="text-gray-500 mb-6">Select a category to view listings</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate("/classifieds")}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-md hover:bg-blue-50 transition"
            >
              <span className="text-4xl mb-2">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 text-center">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;