import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as waitlistService from '../../services/waitlistService';
import * as venueService from '../../services/venueService';
import * as userService from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [latestWaitlist, setLatestWaitlist] = useState(null);
  const [venuesStats, setVenuesStats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [venuesMap, setVenuesMap] = useState({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const allVenues = await venueService.getAllVenues();
        const map = {};
        allVenues.forEach(v => map[v.id] = v.name);
        setVenuesMap(map);

        if (user.role === 'customer') {
          const waitlists = await waitlistService.getMyWaitlist();
          const active = waitlists.find(w => w.status === 'waiting');
          setLatestWaitlist(active || null);
        }

        if (user.role === 'staff') {
          const stats = await venueService.getStaffVenues(); // staff venues
          const updatedStats = await Promise.all(
            stats.map(async (venue) => {
              const waitlists = await waitlistService.getVenueWaitlistsStaff(venue.id);
              const seatedCount = waitlists.filter(w => w.status === 'seated').length;
              return { ...venue, totalCustomers: seatedCount };
            })
          );
          setVenuesStats(updatedStats);
        }

        if (user.role === 'admin') {
          const users = await userService.index2();
          setAllUsers(users);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  const getCountdown = (waitlist) => {
    if (!waitlist) return null;

    const venueAvgTime = waitlist.venue_avg_service_time || 5; // fallback 5 min
    const etaMs = waitlist.position * venueAvgTime * 60 * 1000; // milliseconds
    const endTime = new Date(Date.now() + etaMs);
    const diff = endTime - Date.now();
    if (diff <= 0) return 'Your turn is up!';

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleCancel = async () => {
    if (!latestWaitlist) return;
    try {
      await waitlistService.cancelWaitlist(latestWaitlist.id);
      setLatestWaitlist(null);
    } catch (err) {
      console.error(err);
      alert('Failed to cancel waitlist.');
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <main>
      <h1>Welcome, {user.username}!</h1>

      {user.role === 'customer' && (
        <div className='fcontainer'>
          {latestWaitlist ? (
            <section className="waitlist-container">
              <div className="waitlist-header">
                <h2>Active Waitlist</h2>
                <span
                  className="cancel-icon"
                  onClick={() => setShowCancelConfirm(true)}
                  title="Cancel Waitlist"
                >
                  ✖
                </span>
              </div>
              <p>Venue: <strong>{venuesMap[latestWaitlist.venue_id] || 'Unknown'}</strong></p>
              <p>Position in Queue: <strong>{latestWaitlist.position}</strong></p>
              <p>Estimated Wait Time: <strong>{getCountdown(latestWaitlist)}</strong></p>

              {showCancelConfirm && (
                <div className="cancel-confirm-container">
                  <p>Are you sure you want to cancel your waitlist?</p>
                  <div className="cancel-buttons">
                    <button
                      className="confirm-btn"
                      onClick={async () => {
                        await handleCancel();
                        setShowCancelConfirm(false);
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </section>
          ) : (
            <section>
              <h2>Welcome to QueueMate</h2>
              <p>
                QueueMate allows you to join and track venue waitlists efficiently.
                Start by browsing available venues and add yourself to a queue to get live updates.
              </p>
            </section>
          )}
          <button onClick={() => navigate('/venues')}>Browse Venues</button>
        </div>
      )}

      {user.role === 'staff' && (
        <section>
          <h2>Your Venue Overview</h2>
          {venuesStats.length === 0 ? (
            <p>You currently have no active venues. Create one to start managing waitlists.</p>
          ) : (
            venuesStats.map((venue) => (
              <div key={venue.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                <h3>{venue.name}</h3>
                <p>Total Served Today: <strong>{venue.totalCustomers}</strong></p>
                <button onClick={() => navigate(`/venues/${venue.id}`)}>View Venue</button>
              </div>
            ))
          )}
          <h2>Quick Actions</h2>
          <button onClick={() => navigate('/create/venue')}>Create Venue</button>
        </section>
      )}

      {user.role === 'admin' && (
        <section>
          <h2>Admin Overview</h2>
          <p>Total Users: <strong>{allUsers.length}</strong></p>
          <button onClick={() => navigate('/admin/create-staff')}>Add Staff</button>
          <button onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
          <button onClick={() => navigate('/admin/analytics')}>View Analytics</button>
          <ul>
            {allUsers.map(u => (
              <li key={u.username}>
                {u.username} ({u.role})
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default Dashboard;
