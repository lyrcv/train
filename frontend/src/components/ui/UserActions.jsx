import React from "react";

const UserActions = ({ user, onEdit, onDelete, onToggleActive }) => {
  return (
    <div className="btn-group">
      <button className="btn btn-sm btn-warning" onClick={() => onEdit(user)}>
        <i className="fas fa-edit"></i> Sửa
      </button>
      <button className="btn btn-sm btn-danger" onClick={() => onDelete(user.id, user.name, user.group_role)}>
        <i className="fas fa-trash-alt"></i> Xóa
      </button>
      <button
        className="btn btn-sm btn-dark"
        onClick={() => onToggleActive(user.id, user.is_active, user.name, user.group_role)}
      >
        <i className="fas fa-lock"></i> {user.is_active ? "Khóa" : "Mở"}
      </button>
    </div>
  );
};

export default UserActions;
