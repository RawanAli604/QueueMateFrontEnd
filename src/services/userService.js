const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`;

export const index = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found. Please log in.');

  try {
    const res = await fetch(`${BASE_URL}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error('index error:', err);
    throw err;
  }
};

export const index2 = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found. Please log in.');

  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Request failed: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('index2 error:', err);
    throw err;
  }
};
