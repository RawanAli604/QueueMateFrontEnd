import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as venueService from "../../services/venueService";
import './Createvenue.css';

export default function CreateVenuePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    max_capacity: "",
    avg_service_time: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Delete chosen image
  const handleDeleteImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // For now, we send the local file as a URL string placeholder
      const payload = {
        ...formData,
        max_capacity: parseInt(formData.max_capacity),
        avg_service_time: parseInt(formData.avg_service_time),
        image_url: imagePreview || null,
      };

      await venueService.createVenue(payload);
      alert("Venue created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create venue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <h1>Create New Venue</h1>
      <section className="form-container">
        <form onSubmit={handleSubmit}>
          <label>
            Venue Name
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </label>

          <label>
            Location
            <input type="text" name="location" value={formData.location} onChange={handleChange} required />
          </label>

          <label>
            Max Capacity
            <input type="number" name="max_capacity" value={formData.max_capacity} onChange={handleChange} required />
          </label>

          <label>
            Avg Service Time (mins)
            <input type="number" name="avg_service_time" value={formData.avg_service_time} onChange={handleChange} />
          </label>

          <label>
            Venue Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {imagePreview && (
            <div className="image-picker">
              <img src={imagePreview} alt="Preview" />
              <div className="delete-icon" onClick={handleDeleteImage}>×</div>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Venue"}
          </button>
        </form>
      </section>
    </main>
  );
}
