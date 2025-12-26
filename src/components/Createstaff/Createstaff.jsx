import { useState } from "react";
import { createStaff } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import './Createstaff.css';

export default function CreateStaffPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createStaff({ username, password, email });
      setModal({ title: "Success", message: "Staff created successfully!", type: "success" });
    } catch (err) {
      setModal({ title: "Error", message: err.message || "Failed to create staff", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModal(null);
    if (modal?.type === "success") navigate('/admin/manage-users');
  };

  return (
    <main className="create-staff-page">
      <h1>Create Staff</h1>
      <form className="staff-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} required onChange={e => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} required onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} required onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Staff"}</button>
      </form>

      {modal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>{modal.title}</h2>
            <p>{modal.message}</p>
            <button onClick={handleClose}>OK</button>
          </div>
        </div>
      )}
    </main>
  );
}
