import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getMyWaitlist } from "../../services/waitlistService";

export default function WaitlistHistoryPage() {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const entries = await getMyWaitlist();
        setHistory(entries);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <p>Loading waitlist history...</p>;
  if (history.length === 0) return <p>No past waitlists found.</p>;

  return (
    <main>
      <h1>Waitlist History</h1>
      {history.map(entry => (
        <div key={entry.id} style={{border:'1px solid #ccc', padding:'10px', margin:'10px'}}>
          <h3>Venue: {entry.venue_name}</h3>
          <p>Status: {entry.status}</p>
          <p>Position: {entry.position ?? "-"}</p>
          <p>Time: {new Date(entry.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </main>
  );
}
