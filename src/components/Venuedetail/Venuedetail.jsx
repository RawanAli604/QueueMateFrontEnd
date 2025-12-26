import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { deleteVenue } from "../../services/adminService";
import {
  getMyWaitlist,
  getVenueWaitlists,
  getVenueWaitlistsStaff,
  joinWaitlist
} from "../../services/waitlistService";

import { getVenueById } from "../../services/venueService";
import "./Venuedetail.css";

export default function VenueDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [venue, setVenue] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [myEntry, setMyEntry] = useState(null);
  const [showPendingContainer, setShowPendingContainer] = useState(false);
  const [modal, setModal] = useState(null);
  const [loadingId, setLoadingId] = useState(null);


  useEffect(() => {
    loadPage();
  }, [id, user]);

  const loadPage = async () => {
    const venueData = await getVenueById(id);
    setVenue(venueData);

    if (user?.role === "staff") {
      const entries = await getVenueWaitlistsStaff(id);
      const pending = entries.filter(e => e.status === "pending");
      setWaitlistCount(pending.length);

    } else if (user?.role === "customer") {
      const entries = await getVenueWaitlists(id);

      const waiting = entries.filter(e => e.status === "waiting");
      setWaitlistCount(waiting.length);

      const mine = entries.find(
        e => e.user_id === user.id && e.status === "waiting"
      );
      setMyEntry(mine || null);
    }
  };

  const handleJoin = async () => {
    try {
      const entry = await joinWaitlist(Number(id));

      setShowPendingContainer(true);
      setMyEntry(entry);

    } catch (err) {
      if (err.message.includes("already")) {
        setShowPendingContainer(true);
      } else {
        alert(err.message);
      }
    }
  };
  
  const handleDeleteVenue = (venue) => {
    setModal({
      type: "confirm",
      title: "Delete Venue",
      message: `Are you sure you want to delete "${venue.name}"?`,
      venueId: venue.id,
    });
  };

  const confirmDelete = async () => {
    if (!modal?.venueId) return;
    setLoadingId(modal.venueId);
    try {
      await deleteVenue(modal.venueId);
      setModal({ type: "info", title: "Deleted", message: "Venue deleted successfully!" });
      navigate("/venues");
    } catch (err) {
      setModal({ type: "error", title: "Error", message: err.message || "Failed to delete venue" });
    } finally {
      setLoadingId(null);
    }
  };

  const closeModal = () => setModal(null);
  if (!venue) return <p>Loading...</p>;

  return (
    <main className="venue-details-page">

      {showPendingContainer && (
        <div className="pending-container-overlay">
          <div className="pending-container">
            <h2>Pending Waitlist</h2>
            <p>Your request is pending approval.</p>
            <p>Please wait until staff approves it.</p>
            <button className="close-btn" onClick={() => setShowPendingContainer(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="venues-list">
      {modal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>{modal.title}</h2>
            <p>{modal.message}</p>
            {modal.type === "confirm" ? (
              <div className="modal-buttons">
                <button onClick={confirmDelete} disabled={loadingId === modal.venueId}>
                  {loadingId === modal.venueId ? "Deleting..." : "Yes, Delete"}
                </button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            ) : (
              <button onClick={closeModal}>OK</button>
            )}
          </div>
        </div>
      )}
    </div>

      <div className="venue-card">
        <h1 className="venue-name">{venue.name}</h1>
        <img src={venue.image_url}></img>
        <p><strong>Location:</strong> {venue.location}</p>
        <p><strong>Max-capacity:</strong> {venue.max_capacity}</p>
        <p>
          <strong>
            {user?.role === "staff"
              ? "Pending waitlist requests:"
              : "People currently in queue:"}
          </strong>{" "}
          {waitlistCount}
        </p>

        {user?.role === "customer" && !myEntry && (
          <button onClick={handleJoin}>Join Waitlist</button>
        )}

        {user?.role === "customer" && myEntry && (
          <div className="waitlist-status">
            <strong>You are currently in the queue</strong>
            <p>Status: waiting</p>
            <p>Position: {myEntry.position ?? "-"}</p>
          </div>
        )}

        {user?.role === "staff" && (
          <>
          <button onClick={() => navigate(`/waitlist/my/${venue.id}`)}>
            Manage Pending Waitlist
          </button>
          <button onClick={() => navigate(`/venue/edit/${venue.id}`)}>
            Edit Venue
          </button>
          </>
        )}
        {user?.role === "admin" && (
          <button onClick={() => handleDeleteVenue(venue)}>
            Delete Venue
          </button>
        )}
      </div>
    </main>
  );
}
