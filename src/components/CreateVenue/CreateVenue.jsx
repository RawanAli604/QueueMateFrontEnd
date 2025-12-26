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

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.name.trim() || !formData.location.trim() || !formData.max_capacity) {
      setErrorMsg("Please fill in all required fields!");
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      max_capacity: parseInt(formData.max_capacity, 10),
      avg_service_time: formData.avg_service_time
        ? parseInt(formData.avg_service_time, 10)
        : 0,
      image_url: imagePreview || null,
    };

    try {
      await venueService.createVenue(payload);
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create venue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-venue-page">
      {errorMsg && (
        <div className="error-container">
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg("")}>Close</button>
        </div>
      )}

      <section className="venue-form-container">
        <h1>Create Venue</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Venue Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />
          <input
            type="number"
            name="max_capacity"
            placeholder="Max Capacity"
            value={formData.max_capacity}
            onChange={handleChange}
          />
          <input
            type="number"
            name="avg_service_time"
            placeholder="Average Service Time (mins)"
            value={formData.avg_service_time}
            onChange={handleChange}
          />

          <label className="image-upload-label">
            Select Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" onClick={() => setImagePreview(null)}>Remove</button>
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
