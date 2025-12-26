const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch users");
  }
  return await res.json();
};

export const deleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete user");
  }
  return await res.json();
};

export const createStaff = async (data) => {
  const res = await fetch(`${BASE_URL}/admin/staff`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create staff");
  }
  return await res.json();
};

export const getAllVenues = async () => {
  const res = await fetch(`${BASE_URL}/venues`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch venues");
  }
  return await res.json();
};

export const deleteVenue = async (venueId) => {
  const res = await fetch(`${BASE_URL}/admin/venues/${venueId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete venue");
  }
  return await res.json();
};

export const getAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/admin/analytics`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to fetch analytics");
  }
  return await res.json();
};
