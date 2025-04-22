import React, { useState, useEffect } from "react";
import { Layout } from "../common/Layout";
import { toast } from "react-toastify";
import "../../assets/css/UsersList.scss";
import { apiUrl } from "../common/http";

export const UsersList = () => {
  // Khai báo state để lưu danh sách người dùng, phân trang, và các thông tin tìm kiếm
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [search, setSearch] = useState({
    name: "",
    email: "",
    group: "",
    status: "",
  });

  // Hàm fetch dữ liệu người dùng từ API với các tham số tìm kiếm
  const fetchUsers = async (page = 1) => {
    try {
      // Gửi request tới API để lấy danh sách người dùng theo trang và các tham số tìm kiếm
      const response = await fetch(
        `${apiUrl}/users?page=${page}&name=${search.name}&email=${search.email}&group=${search.group}&status=${search.status}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer $("token")}`,  // Cần thay thế đúng với token người dùng
            "Content-Type": "application/json",
          },
        }
      );

      // Kiểm tra nếu response không hợp lệ
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();  // Chuyển dữ liệu trả về thành JSON
      setUsers(result.data);  // Lưu dữ liệu người dùng vào state
      setPagination({
        currentPage: result.current_page,
        totalPages: result.last_page,  // Cập nhật phân trang
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Có lỗi xảy ra khi lấy dữ liệu người dùng.");  // Thông báo lỗi nếu không lấy được dữ liệu
    }
  };

  // Sử dụng useEffect để gọi fetchUsers khi thông tin tìm kiếm thay đổi
  useEffect(() => {
    fetchUsers();
  }, [search]);

  // Hàm xử lý khi thay đổi giá trị trong ô tìm kiếm
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,  // Cập nhật state tìm kiếm với giá trị mới
    }));
  };

  // Hàm xử lý khi nhấn nút "Tìm kiếm"
  const handleSearchClick = () => {
    fetchUsers(1);  // Lấy dữ liệu từ trang 1 với các bộ lọc tìm kiếm
  };

  // Hàm xử lý khi nhấn nút "Xóa tìm"
  const handleClearSearch = () => {
    setSearch({ name: "", email: "", group: "", status: "" });  // Reset bộ lọc tìm kiếm
    fetchUsers(1);  // Lấy lại danh sách người dùng từ trang 1 mà không có bộ lọc
  };

  return (
    <Layout>
      <main>
        <div className="user-list">
          <div className="user-list__header d-flex justify-content-between align-items-center mb-4">
            <h3 className="title">📋 Danh sách người dùng</h3>
            <button className="btn btn-success shadow-sm">
              <i className="fas fa-plus-circle me-2"></i>Thêm mới
            </button>
          </div>

          {/* Phần tìm kiếm người dùng */}
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
                <option value="Admin">Admin</option>
                <option value="Editor">Editor</option>
                <option value="Reviewer">Reviewer</option>
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
              <button className="btn btn-primary me-2" onClick={handleSearchClick}>
                Tìm kiếm
              </button>
              <button className="btn btn-outline-secondary" onClick={handleClearSearch}>
                Xóa tìm
              </button>
            </div>
          </div>

          {/* Bảng hiển thị danh sách người dùng */}
          <div className="table-responsive shadow-sm rounded user-list__table">
            <table className="table table-bordered text-center align-middle table-hover">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Nhóm</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
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
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-sm btn-warning">
                            <i className="fas fa-edit"></i> Sửa
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <i className="fas fa-trash-alt"></i> Xóa
                          </button>
                          <button className="btn btn-sm btn-dark">
                            <i className="fas fa-lock"></i> Khóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Không có người dùng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-end">
                <li
                  className={`page-item ${
                    pagination.currentPage === 1 ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => fetchUsers(pagination.currentPage - 1)}
                  >
                    «
                  </button>
                </li>
                <li className="page-item active">
                  <button className="page-link">{pagination.currentPage}</button>
                </li>
                <li
                  className={`page-item ${
                    pagination.currentPage === pagination.totalPages
                      ? "disabled"
                      : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => fetchUsers(pagination.currentPage + 1)}
                  >
                    »
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default UsersList;
