import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categories from "../data/categories";
import { createAd, getCurrentUser } from "../services/api";

function PostAd() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", category: "", description: "",
    price: "", location: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect to login if not logged in
    if (!getCurrentUser()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const user = getCurrentUser();

      // Use FormData to send both text and image
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("price", form.price || 0);
      formData.append("location", form.location);
      formData.append("posterName", user?.name || "");
      formData.append("posterPhone", user?.phone || "");
      formData.append("posterWhatsapp", user?.whatsapp || "");
      formData.append("posterEmail", user?.email || "");
      if (image) formData.append("image", image);

      const data = await createAd(formData);
      if (data.success) {
        alert("✅ Ad submitted! It will appear after admin approval.");
        navigate("/classifieds");
      } else {
        setError(data.message || "Failed to submit ad.");
      }
    } catch (err) {
      setError("Cannot connect to server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Post an Ad</h2>
        <p className="text-gray-400 text-sm mb-6">Fill in the details below to list your ad</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. iPhone 13 for sale" required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.icon} {cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe your item or service..." required rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (AED)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange}
              placeholder="e.g. 500"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input type="text" name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. Sharjah, UAE" required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImage}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Ad for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostAd;