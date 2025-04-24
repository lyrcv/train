import React, { useState, useEffect } from "react";
import { Layout } from "../common/Layout";
import { toast } from "react-toastify";
import "../../assets/css/UsersList.scss";
import { apiUrl } from "../common/http";
import PaginationControl from "./PaginationControl";
import $ from "jquery";
import Swal from "sweetalert2";

export const UsersList = () => {
  // Danh sách người dùng
  const [users, setUsers] = useState([]);

  // Thông tin phân trang gồm trang hiện tại, tổng trang, số bản ghi
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
  });

  // Số lượng bản ghi mỗi trang, mặc định 20
  const [perPage, setPerPage] = useState(20);

  // Bộ lọc tìm kiếm người dùng
  const [search, setSearch] = useState({
    name: "",
    email: "",
    group: "",
    status: "",
  });

  // Lấy token từ localStorage hoặc sessionStorage
  const getToken = () => {
    const userInfo =
      JSON.parse(localStorage.getItem("userInfo")) ||
      JSON.parse(sessionStorage.getItem("userInfo"));
    return userInfo?.token || null;
  };

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = (page = 1) => {
    const token = getToken();
    const hasFilter =
      search.name || search.email || search.group || search.status;

    // Nếu có filter thì gọi endpoint /users/search, ngược lại là /users
    const endpoint = hasFilter ? "users/search" : "users";

    // Dữ liệu query gửi lên API
    const query = {
      page: page,
      per_page: perPage,
      name: search.name,
      email: search.email,
      group: search.group,
      status: search.status,
    };

    // Gọi Ajax API
    $.ajax({
      url: `${apiUrl}${endpoint}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      data: query,
      success: function (result) {
        // Nếu trang hiện tại > tổng trang, quay lại trang cuối
        if (result.current_page > result.last_page) {
          fetchUsers(result.last_page);
          return;
        }

        // Cập nhật danh sách và trạng thái phân trang
        setUsers(result.data);
        setPagination({
          currentPage: result.current_page,
          totalPages: result.last_page,
          perPage: perPage,
        });
      },
      error: function (xhr, status, error) {
        console.error("Lỗi Ajax:", error);
        toast.error("Không thể tải danh sách người dùng.");
      },
    });

    // Xóa mềm người dùng
  };

  // Khi thay đổi perPage -> tính lại trang phù hợp để giữ đúng bản ghi đang xem
  useEffect(() => {
    const offset = (pagination.currentPage - 1) * pagination.perPage;
    const newPage = Math.floor(offset / perPage) + 1;
    fetchUsers(newPage);
    // eslint-disable-next-line
  }, [perPage]);

  // Cập nhật giá trị tìm kiếm khi nhập
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  // Tìm kiếm người dùng
  const handleSearchClick = () => {
    fetchUsers(1);
  };

  // Xóa bộ lọc tìm kiếm và load lại trang đầu
  const handleClearSearch = () => {
    setSearch({ name: "", email: "", group: "", status: "" });
    fetchUsers(1);
  };

  // Thêm mới người dùng
  const handleAddUser = () => {
    Swal.fire({
      title: "Thêm người dùng mới",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Tên">
        <input id="swal-email" class="swal2-input" placeholder="Email">
        <input id="swal-password" type="password" class="swal2-input" placeholder="Mật khẩu">
        <select id="swal-role" class="swal2-input">
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="reviewer" selected>Reviewer</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Thêm",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
        const email = document.getElementById("swal-email").value;
        const password = document.getElementById("swal-password").value;
        const group_role = document.getElementById("swal-role").value;
  
        if (!name || !email || !password || !group_role) {
          Swal.showValidationMessage("Vui lòng điền đầy đủ thông tin.");
          return false;
        }
  
        return { name, email, password, group_role };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${apiUrl}users`,
          method: "POST",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify(result.value),
          success: function (res) {
            toast.success(res.message);
            fetchUsers(pagination.currentPage);
          },
          error: function (xhr) {
            const res = xhr.responseJSON;
            if (res?.errors) {
              const errorText = Object.values(res.errors).flat().join("<br>");
              Swal.fire({
                title: "Lỗi",
                html: errorText,
                icon: "error",
              }).then(() => {
                handleAddUser(result.value, errorText);
              });
            } else {
              toast.error("Thêm người dùng thất bại.");
            }
          },
        });
      }
    });
  };  

  // Sửa người dùng
  const handleEditUser = (user) => {
    Swal.fire({
      title: "Chỉnh sửa người dùng",
      html: `
        <input id="swal-name" class="swal2-input" placeholder="Tên" value="${user.name}">
        <input id="swal-email" class="swal2-input" value="${user.email}" disabled>
        <select id="swal-role" class="swal2-input" disabled>
          <option value="admin" ${user.group_role === "admin" ? "selected" : ""}>Admin</option>
          <option value="editor" ${user.group_role === "editor" ? "selected" : ""}>Editor</option>
          <option value="reviewer" ${user.group_role === "reviewer" ? "selected" : ""}>Reviewer</option>
        </select>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
      preConfirm: () => {
        const name = document.getElementById("swal-name").value;
  
        if (!name) {
          Swal.showValidationMessage("Tên không được để trống.");
          return false;
        }
  
        return { name }; // chỉ cập nhật name thôi
      },
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${apiUrl}users/${user.id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          data: JSON.stringify(result.value),
          success: function (res) {
            toast.success(res.message);
            fetchUsers(pagination.currentPage);
          },
          error: function () {
            toast.error("Cập nhật thất bại.");
          },
        });
      }
    });
  };
  

  // Xóa người dùng
  const handleDelete = (id, name, groupRole) => {
    if (groupRole === 'admin') {
      toast.error("Không thể xóa người dùng có quyền Admin.");
      return;
    }
  
    Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa người dùng "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${apiUrl}users/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          success: function () {
            toast.success("Đã xóa người dùng.");
            fetchUsers(pagination.currentPage);
          },
          error: function () {
            toast.error("Xóa người dùng thất bại.");
          },
        });
      }
    });
  };
  

  // Khóa hoặc mở khóa tài khoản
  const handleToggleActive = (id, isActive, name, groupRole) => {
    if (groupRole === 'admin') {
      toast.error("Không thể khóa hoặc mở khóa tài khoản người dùng Admin.");
      return;
    }
  
    Swal.fire({
      title: isActive ? "Khóa tài khoản?" : "Mở khóa tài khoản?",
      text: isActive
        ? `Bạn có chắc chắn muốn khóa tài khoản "${name}" không?`
        : `Bạn có chắc chắn muốn mở khóa tài khoản "${name}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isActive ? "Khóa" : "Mở khóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          url: `${apiUrl}users/toggle-active/${id}`,
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
          success: function (res) {
            toast.success(res.message);
            fetchUsers(pagination.currentPage);
          },
          error: function () {
            toast.error("Thao tác thất bại.");
          },
        });
      }
    });
  };
  

  return (
    <Layout>
      <main>
        <div className="user-list">
          {/* Header*/}
          <div className="user-list__header d-flex justify-content-between align-items-center mb-4">
            <h3 className="title">📋 Danh sách người dùng</h3>
            <button 
              className="btn btn-success shadow-sm"
              onClick={handleAddUser}
            >
              <i className="fas fa-plus-circle me-2"></i>Thêm User
            </button>
          </div>

          {/* Bộ lọc tìm kiếm */}
          <div className="row g-3 mb-4 user-list__filter">
            <div className="col-md-3">
              <input
                type="text"
                name="name"
                value={search.name}
                onChange={handleSearchChange}
                className="form-control"
                placeholder="Nhập họ tên"
              />
            </div>
            <div className="col-md-3">
              <input
                type="email"
                name="email"
                value={search.email}
                onChange={handleSearchChange}
                className="form-control"
                placeholder="Nhập email"
              />
            </div>
            <div className="col-md-2">
              <select
                name="group"
                value={search.group}
                onChange={handleSearchChange}
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
                onChange={handleSearchChange}
                className="form-select"
              >
                <option value="">Trạng thái</option>
                <option value="1">Đang hoạt động</option>
                <option value="0">Tạm khóa</option>
              </select>
            </div>
            <div className="col-md-2 d-grid gap-2 d-md-block">
              <button
                className="btn btn-primary me-2"
                onClick={handleSearchClick}
              >
                Tìm kiếm
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={handleClearSearch}
              >
                Xóa tìm
              </button>
            </div>
          </div>

          {/* Hiển thị số bản ghi mỗi trang */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              Hiển thị
              <select
                className="mx-2"
                value={perPage}
                onChange={(e) => setPerPage(parseInt(e.target.value))}
              >
                {[5, 10, 15, 20, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              đơn vị
            </div>
          </div>

          {/* Bảng danh sách người dùng */}
          <div className="table-responsive shadow-sm rounded user-list__table">
            <table className="table table-bordered text-center align-middle table-hover">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Nhóm</th>
                  <th>Trạng thái</th>
                  <th>Hoạt động</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user.id}>
                      <td>
                        {index + 1 + (pagination.currentPage - 1) * perPage}
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.group_role}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.is_active === 1 ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {user.is_active === 1 ? "Đang hoạt động" : "Tạm khóa"}
                        </span>
                      </td>
                      <td>{user.last_login_at}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEditUser(user)}
                          >
                            <i className="fas fa-edit"></i> Sửa
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => 
                              handleDelete(
                                user.id, 
                                user.name, 
                                user.group_role
                              )
                            }
                          >
                            <i className="fas fa-trash-alt"></i> Xóa
                          </button>
                          <button
                            className="btn btn-sm btn-dark"
                            onClick={() =>
                              handleToggleActive(
                                user.id,
                                user.is_active,
                                user.name,
                                user.group_role
                              )
                            }
                          >
                            <i className="fas fa-lock"></i>{" "}
                            {user.is_active ? "Khóa" : "Mở"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Không có dữ liệu người dùng.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          <PaginationControl
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={(page) => fetchUsers(page)}
          />
        </div>
      </main>
    </Layout>
  );
};

export default UsersList;
