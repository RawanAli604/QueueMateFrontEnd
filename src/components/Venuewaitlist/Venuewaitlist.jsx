import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { getVenueWaitlistsStaff, approveWaitlist, rejectWaitlist, cancelWaitlist } from "../../services/waitlistService";

export default function StaffVenueWaitlist() {
  const { id } = useParams(); // venue id
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
      alert("Approved successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to approve");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (entryId) => {
    setLoadingId(entryId);
    try {
      await rejectWaitlist(entryId);
      setWaitlists(prev => prev.filter(w => w.id !== entryId));
      alert("Rejected successfully!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to reject");
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) return <p>Loading waitlist...</p>;

  return (
    <main>
      <h1>Venue Waitlist</h1>
      {waitlists.length === 0 && <p>No waitlist entries yet.</p>}
      {waitlists.map(w => (
        <div key={w.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p><strong>User:</strong> {w.user?.username ?? "Unknown"}</p>
          <p><strong>Status:</strong> {w.status}</p>
          <p><strong>Position:</strong> {w.position ?? "Pending"}</p>

          {w.status === "pending" && (
            <>
              <button disabled={loadingId === w.id} onClick={() => handleApprove(w.id)}>Approve</button>
              <button disabled={loadingId === w.id} onClick={() => handleReject(w.id)}>Reject</button>
            </>
          )}

        </div>
      ))}
    </main>
  );
}
