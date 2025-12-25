const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

export const getMyWaitlist = async () => {
  const res = await fetch(`${BASE_URL}/waitlist/my`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return await res.json();
};

export const getVenueWaitlists = async (venueId) => {
  const res = await fetch(`${BASE_URL}/waitlist/venue/${venueId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return await res.json();
};
