// Products Management Component

import React from "react";
import Layout from "../common/Layout";

export const ProductsList = () => {
  return (
    <Layout>
      <main>
        <div className="product-list">
          <div className="product-list__header d-flex justify-content-between align-items-center mb-4">
            <h3 className="title">📦 Danh sách sản phẩm</h3>
            <button className="btn btn-success shadow-sm">
              <i className="fas fa-plus-circle me-2"></i>Thêm mới
            </button>
          </div>

          {/* Tìm kiếm */}
          <div className="row g-3 mb-4 product-list__filter">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="col-md-2">
              <select className="form-select">
                <option>Chọn trạng thái</option>
                <option>Đang bán</option>
                <option>Ngừng bán</option>
                <option>Hết hàng</option>
              </select>
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Giá bán từ"
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Giá bán đến"
              />
            </div>
            <div className="col-md-2 d-grid gap-2 d-md-block">
              <button className="btn btn-primary me-2">Tìm kiếm</button>
              <button className="btn btn-outline-secondary">Xóa tìm</button>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="table-responsive shadow-sm rounded product-list__table">
            <table className="table table-bordered text-center align-middle table-hover">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Tên sản phẩm</th>
                  <th>Mô tả</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Sản phẩm A</td>
                  <td>Chức năng sản phẩm A</td>
                  <td>$100</td>
                  <td>
                    <span className="badge bg-success">Đang bán</span>
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
                  <td>Sản phẩm B</td>
                  <td>Chức năng sản phẩm B</td>
                  <td>$12</td>
                  <td>
                    <span className="badge bg-secondary">Hết hàng</span>
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
                {/* Các sản phẩm khác */}
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
  );
};

export default ProductsList;
