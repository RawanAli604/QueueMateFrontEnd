import { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

function UserProvider({ children }) {
  const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        username: payload.username || "User",
        role: payload.role,
      };
    } catch (err) {
      console.error("Invalid token", err);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromToken());

  useEffect(() => {
    const handleStorage = () => setUser(getUserFromToken());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const value = { user, setUser };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };
