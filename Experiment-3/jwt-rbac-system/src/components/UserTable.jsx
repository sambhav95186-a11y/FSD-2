function UserTable({
  users,
  currentUser,
  onEdit,
  onDelete
}) {
  return (
    <div className="table-container">

      <table>

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Role</th>

            {currentUser.role !== "viewer" && (
              <th>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>

          {users.length === 0 ? (
            <tr>
              <td colSpan="7">
                No users found
              </td>
            </tr>
          ) : (

            users.map((user) => (

              <tr key={user.id}>

                <td>{user.id}</td>

                <td>{user.name}</td>

                <td>{user.username}</td>

                <td>{user.password}</td>

                <td>{user.email}</td>

                <td>
                  <span className={`role ${user.role}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>

                {currentUser.role !== "viewer" && (
                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => onEdit(user)}
                    >
                      Edit
                    </button>

                    {currentUser.role === "admin" && (
                      <button
                        className="delete-btn"
                        onClick={() => onDelete(user.id)}
                      >
                        Delete
                      </button>
                    )}

                  </td>
                )}

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default UserTable;