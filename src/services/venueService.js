const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/venue`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

export const getAllVenues = async () => {
  const res = await fetch(`${BASE_URL}`, { headers: getAuthHeaders() });
  return res.json();
};

export const getVenueById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch venue");
  return res.json();
};

export const getStaffVenues = async () => {
  const res = await fetch(`${BASE_URL}/my`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
};

export const createVenue = async (payload) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("CREATE VENUE ERROR:", errData);
      throw new Error(errData.detail || "Failed to create venue");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
