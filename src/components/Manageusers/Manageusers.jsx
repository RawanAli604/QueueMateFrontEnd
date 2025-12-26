import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../services/adminService";
import './Manageusers.css';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      setModal({ title: "Deleted", message: "User deleted successfully", type: "success" });
      setSelectedUser(null);
    } catch (err) {
      setModal({ title: "Error", message: err.message || "Failed to delete user", type: "error" });
    }
  };

  const handleCloseModal = () => setModal(null);

  if (loading) return <p>Loading users...</p>;
  if (!users.length) return <p>No users found.</p>;

  return (
    <main className="manage-users-page">
      <h1>Manage Users</h1>
      <div className="users-list">
        {users.map(u => (
          <div key={u.id} className="history-card" onClick={() => setSelectedUser(u)}>
            <h3>{u.username}</h3>
            <p>Email: {u.email}</p>
            <p>Role: {u.role}</p>
          </div>
        ))}
      </div>

      {selectedUser && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>{selectedUser.username}</h2>
            <p>Email: {selectedUser.email}</p>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={() => handleDelete(selectedUser.id)}>Delete</button>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>{modal.title}</h2>
            <p>{modal.message}</p>
            <button onClick={handleCloseModal}>OK</button>
          </div>
        </div>
      )}
    </main>
  );
}
