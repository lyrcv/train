import React from "react";
import UserActions from "../ui/UserActions";
import { userMessages } from "../../constants/messages/userMessages";


const UserTable = ({ users, pagination, perPage, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="table-responsive shadow-sm rounded user-list__table">
      <table className="table table-bordered text-center align-middle table-hover">
        <thead className="table-primary">
          <tr>
          <th>{userMessages.tableHeaders.index}</th>
          <th>{userMessages.tableHeaders.name}</th>
          <th>{userMessages.tableHeaders.email}</th>
          <th>{userMessages.tableHeaders.group}</th>
          <th>{userMessages.tableHeaders.status}</th>
          <th>{userMessages.tableHeaders.lastActive}</th>
          <th>{userMessages.tableHeaders.actions}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1 + (pagination.currentPage - 1) * perPage}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.group_role}</td>
                <td>
                  <span className={`badge ${user.is_active === 1 ? "bg-success" : "bg-secondary"}`}>
                    {user.is_active === 1 ? userMessages.status.active : userMessages.status.inactive}
                  </span>
                </td>
                <td>{user.last_login_at}</td>
                <td>
                  <UserActions
                    user={user}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleActive={onToggleActive}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">{userMessages.noData}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
