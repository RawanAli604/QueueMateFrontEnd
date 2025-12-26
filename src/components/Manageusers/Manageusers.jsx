import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../services/adminService";
import './Manageusers.css';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("username"); // default sort

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setFiltered(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = users.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
    );
    if (sortBy) result = result.sort((a,b) => a[sortBy]?.localeCompare(b[sortBy]));
    setFiltered(result);
  }, [search, sortBy, users]);

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

      <div className="search-sort">
        <input type="text" placeholder="Search by name, email or role" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="username">Sort by Username</option>
          <option value="email">Sort by Email</option>
          <option value="role">Sort by Role</option>
        </select>
      </div>

      <div className="users-list">
        {filtered.map(u => (
          <div key={u.id} className="history-card" onClick={() => setSelectedUser(u)}>
            <h3>{u.username}</h3>
            <p>Email: {u.email}</p>
            <p>Role: {u.role}</p>
          </div>
        ))}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="modal-container">
          <div className="modal-content">
            <h2>{selectedUser.username}</h2>
            <p>Email: {selectedUser.email}</p>
            <p>Role: {selectedUser.role}</p>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={() => handleDelete(selectedUser.id)}>Delete</button>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Action modal */}
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
