import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../features/users/usersSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", company: "" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState({
    id: null,
    name: "",
    email: "",
    company: "",
  });
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="fs-4">Loading users...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger fs-4">Error: {error}</p>
      </div>
    );
  }

  const results = items
    .filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let fieldA = a[sortField]?.name || a[sortField] || "";
      let fieldB = b[sortField]?.name || b[sortField] || "";
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div
      className="container d-flex justify-content-center"
      style={{ marginTop: "50px" }}
    >
      <div className="card shadow p-4 w-100" style={{ maxWidth: "1000px" }}>
        <h2 className="mb-4 text-center">📋 User List</h2>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <input
            type="text"
            className="form-control w-75"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="btn btn-primary ms-3"
            onClick={() => setShowAddModal(true)}
          >
            + Add User
          </button>
        </div>

        <div className="mb-3">
          <label className="me-2 fw-bold">Sort by:</label>
          <select
            className="form-select w-auto d-inline"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="company">Company</option>
          </select>
          <button
            className="btn btn-sm btn-outline-secondary ms-2"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? " Asc" : " Desc"}
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((user) => (
                  <tr key={user.id}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedUser(user)}
                    >
                      <strong>{user.name}</strong>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.company?.name || user.company}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditUser({
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            company: user.company?.name || user.company,
                          });
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => dispatch(deleteUser(user.id))}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedUser.name}</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <b>Email:</b> {selectedUser.email}
                </p>
                <p>
                  <b>Company:</b>{" "}
                  {selectedUser.company?.name || selectedUser.company}
                </p>
                <p>
                  <b>Phone:</b> {selectedUser.phone}
                </p>
                <p>
                  <b>Website:</b> {selectedUser.website}
                </p>
                <p>
                  <b>Address:</b> {selectedUser.address?.street},{" "}
                  {selectedUser.address?.city}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newUser.name || !newUser.email) return;
                    const id = Date.now();
                    dispatch(
                      addUser({
                        id,
                        name: newUser.name,
                        email: newUser.email,
                        company: { name: newUser.company || "N/A" },
                      })
                    );

                    setNewUser({ name: "", email: "", company: "" });
                    setShowAddModal(false);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Company"
                    value={newUser.company}
                    onChange={(e) =>
                      setNewUser({ ...newUser, company: e.target.value })
                    }
                  />
                  <button type="submit" className="btn btn-success w-100">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(updateUser(editUser));
                    setShowEditModal(false);
                  }}
                >
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editUser.name}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    required
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({ ...editUser, email: e.target.value })
                    }
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={editUser.company}
                    onChange={(e) =>
                      setEditUser({ ...editUser, company: e.target.value })
                    }
                  />
                  <button type="submit" className="btn btn-success w-100">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
