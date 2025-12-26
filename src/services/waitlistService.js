const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export const getMyWaitlist = async () => {
  const res = await fetch(`${BASE_URL}/waitlist/my`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to fetch venue waitlist');
  }
  const data = await res.json();
  return data;
};

export const getVenueWaitlists = async (venueId) => {
  const res = await fetch(`${BASE_URL}/waitlist/my/${venueId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  const data = await res.json();
  return data;
};

export const joinWaitlist = async (venueId) => {
  const res = await fetch(`${BASE_URL}/waitlist`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      venue_id: Number(venueId),
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("WAITLIST ERROR:", JSON.stringify(data, null, 2));
    const message =
      Array.isArray(data?.detail) && data.detail[0]?.msg
        ? data.detail[0].msg
        : data.detail || "Unknown validation error";
    throw new Error(message);
  }

  return data;
};

export const getVenueWaitlistsStaff = async (venueId) => {
  const res = await fetch(`${BASE_URL}/waitlist/venue/${venueId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to fetch venue waitlist');
  }

  return await res.json();
};

export const cancelWaitlist = async (entryId) => {
  const res = await fetch(`${BASE_URL}/waitlist/my/${entryId}/cancel`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to cancel waitlist entry');
  }

  return await res.json();
};

export const getSingleWaitlistEntry = async (entryId) => {
  const res = await fetch(`${BASE_URL}/waitlist/my/${entryId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to fetch waitlist entry');
  }

  return await res.json();
};

export const approveWaitlist = async (entryId) => {
  const res = await fetch(`${BASE_URL}/waitlist/${entryId}/approve`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to approve waitlist entry');
  }

  return await res.json();
};

export const rejectWaitlist = async (entryId) => {
  const res = await fetch(`${BASE_URL}/waitlist/${entryId}/reject`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to reject waitlist entry');
  }

  return await res.json();
};

export const markAsSeated = async (entryId) => {
  const res = await fetch(`${BASE_URL}/waitlist/${entryId}/seated`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Failed to mark as seated');
  }

  return await res.json();
};

export const getVenueWaitlistCount = async (venueId) => {
  const res = await fetch(`${BASE_URL}/waitlist/venue/count/${venueId}`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch waitlist count");
  }
  const data = await res.json();
  return data.waiting_count;
};