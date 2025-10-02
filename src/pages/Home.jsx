import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../features/users/usersSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.users);

  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

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

  const filtered = items.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="container-fluid d-flex justify-content-center" style={{ marginTop: "50px" }}>
      <div className="card shadow p-4 w-100" style={{ maxWidth: "1000px" }}>
        <h2 className="mb-4 text-center">📋 User List</h2>

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Company</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td><strong>{user.name}</strong></td>
                    <td>{user.email}</td>
                    <td>{user.company?.name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
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
          tabIndex="-1"
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
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><b>Email:</b> {selectedUser.email}</p>
                <p><b>Company:</b> {selectedUser.company?.name}</p>
                <p><b>Phone:</b> {selectedUser.phone}</p>
                <p><b>Website:</b> {selectedUser.website}</p>
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
    </div>
  );
}
