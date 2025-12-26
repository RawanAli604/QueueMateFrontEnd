import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getMyWaitlist } from "../../services/waitlistService";
import { getAllVenues } from "../../services/venueService";
import './Waitlisthistory.css';

export default function WaitlistHistoryPage() {
  const { user } = useContext(UserContext);
  const [history, setHistory] = useState([]);
  const [venuesMap, setVenuesMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch all venues and map id => name
        const venues = await getAllVenues();
        const map = {};
        venues.forEach(v => map[v.id] = v.name);
        setVenuesMap(map);

        // Fetch user's waitlist history
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
        <div key={entry.id} className="history-card">
        <h3>Venue: {venuesMap[entry.venue_id] || "Unknown"}</h3>
        <span className={`status-badge status-${entry.status}`}>
         {entry.status}
        </span>          
        <p>Time: {new Date(entry.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </main>
  );
}
