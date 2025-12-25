const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL;

export const signUp = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Sign up failed');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const signIn = async (userData) => {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
