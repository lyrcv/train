import React from "react";
import { Layout } from "../common/Layout";
import "../../assets/css/UsersList.scss";

export const UsersList = () => {
  return (
    <>
      <Layout>
        <main>
          <div className="user-list">
            <div className="user-list__header d-flex justify-content-between align-items-center mb-4">
              <h3 className="title">📋 Danh sách người dùng</h3>
              <button className="btn btn-success shadow-sm">
                <i className="fas fa-plus-circle me-2"></i>Thêm mới
              </button>
            </div>

            {/* Tìm kiếm */}
            <div className="row g-3 mb-4 user-list__filter">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Nhập email"
                />
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option>Chọn nhóm</option>
                  <option>Admin</option>
                  <option>Editor</option>
                  <option>Reviewer</option>
                </select>
              </div>
              <div className="col-md-2">
                <select className="form-select">
                  <option>Trạng thái</option>
                  <option>Đang hoạt động</option>
                  <option>Tạm khóa</option>
                </select>
              </div>
              <div className="col-md-2 d-grid gap-2 d-md-block">
                <button className="btn btn-primary me-2">Tìm kiếm</button>
                <button className="btn btn-outline-secondary">Xóa tìm</button>
              </div>
            </div>

            {/* Bảng người dùng */}
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
                  <tr>
                    <td>1</td>
                    <td>Nguyễn Văn A</td>
                    <td>a.nguyen@gmail.com</td>
                    <td>Admin</td>
                    <td>
                      <span className="badge bg-success">Đang hoạt động</span>
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
                  <tr>
                    <td>2</td>
                    <td>Nguyễn Văn B</td>
                    <td>b.nguyen@gmail.com</td>
                    <td>Editor</td>
                    <td>
                      <span className="badge bg-secondary">Tạm khóa</span>
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
                          <i className="fas fa-unlock"></i> Mở khóa
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Phân trang */}
            <nav className="mt-4">
              <ul className="pagination justify-content-end">
                <li className="page-item disabled">
                  <a className="page-link" href="#">
                    «
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    »
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </main>
      </Layout>
    </>
  );
};

export default UsersList;
