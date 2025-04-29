import React from "react";

const UserFilter = ({ search, onChange, onSearch, onClear }) => {
  return (
    <div className="row g-3 mb-4 user-list__filter">
      <div className="col-md-3">
        <input
          type="text"
          name="name"
          value={search.name}
          onChange={onChange}
          className="form-control"
          placeholder="Nhập họ tên"
        />
      </div>
      <div className="col-md-3">
        <input
          type="email"
          name="email"
          value={search.email}
          onChange={onChange}
          className="form-control"
          placeholder="Nhập email"
        />
      </div>
      <div className="col-md-2">
        <select
          name="group"
          value={search.group}
          onChange={onChange}
          className="form-select"
        >
          <option value="">Chọn nhóm</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="reviewer">Reviewer</option>
        </select>
      </div>
      <div className="col-md-2">
        <select
          name="status"
          value={search.status}
          onChange={onChange}
          className="form-select"
        >
          <option value="">Trạng thái</option>
          <option value="1">Đang hoạt động</option>
          <option value="0">Tạm khóa</option>
        </select>
      </div>
      <div className="col-md-2 d-grid gap-2 d-md-block">
        <button className="btn btn-primary me-2" onClick={onSearch}>
          Tìm kiếm
        </button>
        <button className="btn btn-outline-secondary" onClick={onClear}>
          Xóa tìm
        </button>
      </div>
    </div>
  );
};

export default UserFilter;
