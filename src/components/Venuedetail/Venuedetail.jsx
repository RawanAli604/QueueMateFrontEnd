import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getVenueById } from "../../services/venueService";
import { joinWaitlist, getMyWaitlist, getVenueWaitlistCount } from "../../services/waitlistService";
import './Venuedetail.css';

export default function VenueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [venue, setVenue] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [myEntry, setMyEntry] = useState(null);

useEffect(() => {
  getVenueById(id)
    .then(setVenue)
    .catch(console.error);

  getVenueWaitlistCount(id)
    .then(setWaitlistCount)
    .catch(() => setWaitlistCount(0));

  if (user?.role === "customer") {
    getMyWaitlist()
      .then(entries => {
        const entry = entries.find(e => e.venue_id === parseInt(id));
        setMyEntry(entry || null);
      })
      .catch(() => {});
  }
}, [id, user]);

  const handleJoin = async () => {
    try {
      const entry = await joinWaitlist(parseInt(id,10));
      setMyEntry(entry);
      setWaitlistCount(prev => prev + 1);
      setTimeout(() => {
        navigate('/waitlist');
      }, 2000);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to join waitlist.");
    }
  };

  if (!venue) return <p>Loading...</p>;

  return (
    <main className="venue-details-page">
      <div className="venue-card">
        {venue.image_url && (
          <div className="venue-image-container">
            <img
              src={venue.image_url}
              alt={venue.name}
              className="venue-image"
            />
          </div>
        )}

        <div className="venue-info">
          <h1 className="venue-name">{venue.name}</h1>
          <p><strong>Location:</strong> {venue.location}</p>
          <p><strong>Max Capacity:</strong> {venue.max_capacity}</p>
          <p><strong>Average Service Time:</strong> {venue.avg_service_time} mins</p>
          <p><strong>Currently on Waitlist:</strong> {waitlistCount}</p>

        {user?.role === "customer" && (!myEntry || myEntry.status !== "waiting") && (
          <button onClick={handleJoin}>Join Waitlist</button>
        )}

          {myEntry && myEntry.status =='waiting' && (
            <div className="waitlist-status">
              <strong>You're on the waitlist!</strong>
              <p>Position: {myEntry.position ?? "Pending"}</p>
              <p>Status: {myEntry.status}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
