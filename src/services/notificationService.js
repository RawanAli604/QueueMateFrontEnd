const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

export const getNotifications = async () => {
  const res = await fetch(`${BASE_URL}/notifications`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return await res.json();
};
