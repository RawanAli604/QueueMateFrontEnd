
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/venue`;
const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

export const getAllVenues = async () => {
  try {
    const res = await fetch(`${BASE_URL}`, { headers });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const getVenueById = async (venueId) => {
  try {
    const res = await fetch(`${BASE_URL}/${venueId}`, { headers });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data;
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};

export const getStaffVenues = async () => {
  try {
    const res = await fetch(`${BASE_URL}/my`, { headers });
    const data = await res.json();
    if (data.err) throw new Error(data.err);
    return data; 
  } catch (err) {
    console.error(err);
    throw new Error(err);
  }
};
