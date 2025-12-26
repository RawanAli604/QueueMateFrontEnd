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
  const [showPendingContainer, setShowPendingContainer] = useState(false); // pending container

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
    const entry = await joinWaitlist(parseInt(id, 10));
    setMyEntry(entry);
    setWaitlistCount(prev => prev + 1);

    setTimeout(() => navigate('/'), 2000);
  } catch (err) {
    console.error(err);
    if (err.message.includes("You already have a waitlist entry for this venue") || err.message.includes("pending")) {
      setShowPendingContainer(true);
    } else {
      alert(err.message || "Failed to join waitlist");
    }
  }
};

  if (!venue) return <p>Loading...</p>;

  return (
    <main className="venue-details-page">
      <div className="venue-card">
        {venue.image_url && (
          <div className="venue-image-container">
            <img src={venue.image_url} alt={venue.name} className="venue-image" />
          </div>
        )}

        <div className="venue-info">
          <h1 className="venue-name">{venue.name}</h1>
          <p><strong>Location:</strong> {venue.location}</p>
          <p><strong>Max Capacity:</strong> {venue.max_capacity}</p>
          <p><strong>Average Service Time:</strong> {venue.avg_service_time} mins</p>
          <p><strong>Currently on Waitlist:</strong> {waitlistCount}</p>

          {/* Join Button */}
          {user?.role === "customer" && (!myEntry || myEntry.status !== "waiting") && (
            <button onClick={handleJoin}>Join Waitlist</button>
          )}

          {showPendingContainer && (
            <div className="pending-container">
              <h2>Pending Waitlist</h2>
              <p>You already have a pending waitlist for this venue.</p>
              <p>Please wait for it to be confirmed before joining again.</p>
              <button className="close-btn" onClick={() => setShowPendingContainer(false)}>Close</button>
            </div>
          )}

          {/* Staff Actions */}
          {user?.role === "staff" && (
            <>
              <button onClick={() => navigate(`/waitlist/my/${venue.id}`)}>Manage Waitlist</button>
              <button onClick={() => navigate(`/venue/edit/${venue.id}`)}>Edit Venue</button>
            </>
          )}

          {myEntry && myEntry.status === 'waiting' && (
            <div className="waitlist-status">
              <strong>You're on the waitlist!</strong>
              <p>Position: {myEntry.position ?? "Pending"}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
