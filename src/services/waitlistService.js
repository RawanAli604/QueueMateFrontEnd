const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

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

export const joinWaitlist = async (venueId) => {
  try {
    const res = await fetch(`${BASE_URL}/waitlist`, {
      method: "POST",
      headers,
      body: JSON.stringify({ venue_id: venueId }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Failed to join waitlist");
    }
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};