import { useState } from "react";
import { createStaff } from "../../services/adminService"; // create this service
import { useNavigate } from "react-router-dom";
import './Createstaff.css';

export default function CreateStaffPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await createStaff({ username, password, email });
      setMessage("Staff created successfully!");
      setTimeout(() => navigate('/admin/manage-users'), 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to create staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <h1>Create Staff</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </main>
  );
}
