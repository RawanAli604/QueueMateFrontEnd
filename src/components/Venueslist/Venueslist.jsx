import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { 
  getVenueWaitlistsStaff, 
  approveWaitlist, 
  rejectWaitlist, 
  markAsSeated 
} from "../../services/waitlistService";
import './Venueslist.css';

export default function StaffVenueWaitlist() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [waitlists, setWaitlists] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "staff") return;

    const fetchWaitlists = async () => {
      try {
        const data = await getVenueWaitlistsStaff(id);
        setWaitlists(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlists();
  }, [id, user]);

  const handleApprove = async (entryId) => {
    setLoadingId(entryId);
    try {
      const updated = await approveWaitlist(entryId);
      setWaitlists(prev => prev.map(w => (w.id === entryId ? updated : w)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (entryId) => {
    setLoadingId(entryId);
    try {
      await rejectWaitlist(entryId);
      setWaitlists(prev => prev.filter(w => w.id !== entryId));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSeated = async (entryId) => {
    setLoadingId(entryId);
    try {
      const updated = await markAsSeated(entryId);
      setWaitlists(prev => prev.map(w => (w.id === entryId ? updated : w)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) return <p>Loading waitlist...</p>;

  return (
    <main className="staff-waitlist-page">
      <h1>Venue Waitlist</h1>
      {waitlists.length === 0 && <p>No waitlist entries yet.</p>}
      {waitlists.map(w => (
        <div key={w.id} className="waitlist-card">
          <p><strong>User:</strong> {w.user.username}</p>
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status-badge ${w.status}`}>
              {w.status.toUpperCase()}
            </span>
          </p>
          <p><strong>Position:</strong> {w.position ?? "Pending"}</p>

          <div className="action-buttons">
            {w.status === "pending" && (
              <>
                <button disabled={loadingId === w.id} onClick={() => handleApprove(w.id)}>Approve</button>
                <button disabled={loadingId === w.id} onClick={() => handleReject(w.id)}>Reject</button>
              </>
            )}

            {w.status === "waiting" && (
              <button disabled={loadingId === w.id} onClick={() => handleSeated(w.id)}>Mark as Seated</button>
            )}
          </div>
        </div>
      ))}
    </main>
  );
}
