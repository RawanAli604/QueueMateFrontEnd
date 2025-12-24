// src/components/Dashboard/Dashboard.jsx
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as waitlistService from '../../services/waitlistService';
import * as venueService from '../../services/venueService';
import * as userService from '../../services/userService';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [latestWaitlist, setLatestWaitlist] = useState(null);
  const [venuesStats, setVenuesStats] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        if (user.role === 'customer') {
          const waitlists = await waitlistService.getMyWaitlist();
          const active = waitlists.find(w => w.status === 'waiting');
          setLatestWaitlist(active || null);
        }

        if (user.role === 'staff') {
          const stats = await venueService.getStaffVenuesStats();
          setVenuesStats(stats);
        }

        if (user.role === 'admin') {
          const users = await userService.index();
          setAllUsers(users);
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user]);

  const getCountdown = (waitlist) => {
    if (!waitlist) return null;
    const eta = new Date(waitlist.estimated_wait_time + Date.now());
    const diff = eta - Date.now();
    if (diff <= 0) return 'Your turn is up!';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <main>
      <h1>Welcome, {user.username}!</h1>

      {user.role === 'customer' && (
        <>
          {latestWaitlist ? (
            <section>
              <h2>Active Waitlist</h2>
              <p>Venue: <strong>{latestWaitlist.venue_name}</strong></p>
              <p>Position in Queue: <strong>{latestWaitlist.position}</strong></p>
              <p>Estimated Wait Time: <strong>{getCountdown(latestWaitlist)}</strong></p>
              <button onClick={() => navigate(`/waitlist/${latestWaitlist.id}`)}>View Details</button>
            </section>
          ) : (
            <section>
              <h2>Welcome to QueueMate</h2>
              <p>
                QueueMate allows you to join and track venue waitlists efficiently.
                Start by browsing available venues and add yourself to a queue to get live updates.
              </p>
              <button onClick={() => navigate('/venues')}>Browse Venues</button>
            </section>
          )}
        </>
      )}

      {user.role === 'staff' && (
        <section>
          <h2>Your Venue Overview</h2>
          {venuesStats.length === 0 && (
            <p>You currently have no active venues. Create one to start managing waitlists.</p>
          )}
          {venuesStats.map((venue) => (
            <div key={venue.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>{venue.name}</h3>
              <p>Active Customers: <strong>{venue.activeCustomers}</strong></p>
              <p>Total Served Today: <strong>{venue.totalCustomers}</strong></p>
              <button onClick={() => navigate(`/venue/${venue.id}/waitlist`)}>Manage Waitlist</button>
              <button onClick={() => navigate(`/venue/${venue.id}/edit`)}>Edit Venue</button>
            </div>
          ))}
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

      <section>
        {user.role === 'staff'&& <h2>Quick Actions</h2> && <button onClick={() => navigate('/create-venue')}>Create Venue</button>}
      </section>
    </main>
  );
};

export default Dashboard;
