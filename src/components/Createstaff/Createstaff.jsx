import { useState } from "react";
import { createStaff } from "../../services/authService";
import { useNavigate } from "react-router-dom";
import './Createstaff.css';

export default function CreateStaffPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setPopup({ type: "error", message: "All fields are required!" });
      return;
    }

    setLoading(true);
    try {
      const newStaff = await createStaff({ username, email, password });
      setPopup({ type: "success", message: `Staff ${newStaff.username} created successfully!` });

      setUsername(""); 
      setEmail(""); 
      setPassword("");

      setTimeout(() => navigate("/admin/users"), 2000);

    } catch (err) {
      setPopup({ type: "error", message: err.message || "Failed to create staff" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="create-staff-page">
      <h1>Create Staff Member</h1>
      <div className="form-container">
        <form className="staff-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Staff"}
          </button>
        </form>

        {popup && (
          <div className={`popup ${popup.type}`}>
            <p>{popup.message}</p>
            <button onClick={() => setPopup(null)}>Close</button>
          </div>
        )}
      </div>
    </main>
  );
}
