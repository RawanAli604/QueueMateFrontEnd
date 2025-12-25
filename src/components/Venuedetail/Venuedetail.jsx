import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getVenueById } from "../../services/venueService";
import { joinWaitlist, getMyWaitlist } from "../../services/waitlistService";
import './Venuedetail.css';

export default function VenueDetailsPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [venue, setVenue] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [myEntry, setMyEntry] = useState(null);

  useEffect(() => {
    // Fetch venue details
    getVenueById(id)
      .then(setVenue)
      .catch(console.error);

    // Fetch user's waitlist to check if already joined
    if (user?.role === "customer") {
      getMyWaitlist()
        .then(entries => {
          const entry = entries.find(e => e.venue_id === parseInt(id));
          setMyEntry(entry || null);

          const waitingCount = entries.filter(e => e.venue_id === parseInt(id) && e.status === "waiting").length;
          setWaitlistCount(waitingCount);
        })
        .catch(() => {});
    }
  }, [id, user]);

  const handleJoin = async () => {
    try {
      const entry = await joinWaitlist(id);
      setMyEntry(entry);
      setWaitlistCount(prev => prev + 1);
      alert("You were added to the waitlist!");
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

          {user?.role === "customer" && !myEntry && (
            <button className="join-btn" onClick={handleJoin}>
              Join Waitlist
            </button>
          )}

          {myEntry && (
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
