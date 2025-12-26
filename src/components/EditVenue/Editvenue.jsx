import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getVenueById, updateVenue } from "../../services/venueService";
import './Editvenue.css';

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [venueData, setVenueData] = useState({
    name: "",
    location: "",
    max_capacity: "",
    avg_service_time: "",
    image_url: null
  });
  const [imageFile, setImageFile] = useState(null);
  const [showError, setShowError] = useState(false);

  // Fetch venue info
  useEffect(() => {
    if (!id) return;
    const fetchVenue = async () => {
      try {
        const data = await getVenueById(id);
        setVenueData({
          name: data.name,
          location: data.location,
          max_capacity: data.max_capacity,
          avg_service_time: data.avg_service_time,
          image_url: data.image_url || null
        });
      } catch (err) {
        console.error("Failed to fetch venue", err);
      }
    };
    fetchVenue();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setVenueData(prev => ({ ...prev, image_url: URL.createObjectURL(e.target.files[0]) }));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setVenueData(prev => ({ ...prev, image_url: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, location, max_capacity, avg_service_time } = venueData;
    if (!name || !location || !max_capacity || !avg_service_time) {
      setShowError(true);
      return;
    }
    try {
      const payload = {
        name,
        location,
        max_capacity: parseInt(max_capacity, 10),
        avg_service_time: parseInt(avg_service_time, 10),
        image_url: venueData.image_url
      };
      await updateVenue(id, payload);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Failed to update venue.");
    }
  };

  return (
    <main className="create-venue-page">
      {showError && (
        <div className="error-container">
          <p>Please fill in all required fields.</p>
          <button onClick={() => setShowError(false)}>OK</button>
        </div>
      )}

      <section className="venue-form-container">
        <h1>Edit Venue</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input type="text" name="name" value={venueData.name} onChange={handleChange} />
          </label>

          <label>
            Location
            <input type="text" name="location" value={venueData.location} onChange={handleChange} />
          </label>

          <label>
            Max Capacity
            <input type="number" name="max_capacity" value={venueData.max_capacity} onChange={handleChange} />
          </label>

          <label>
            Average Service Time (mins)
            <input type="number" name="avg_service_time" value={venueData.avg_service_time} onChange={handleChange} />
          </label>

          <label className="image-upload-label">
            Choose Venue Image
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </label>

          {venueData.image_url && (
            <div className="image-preview">
              <img src={venueData.image_url} alt="Venue" />
              <button type="button" className="delete-icon" onClick={removeImage}>✕</button>
            </div>
          )}

          <button type="submit">Update Venue</button>
        </form>
      </section>
    </main>
  );
}
