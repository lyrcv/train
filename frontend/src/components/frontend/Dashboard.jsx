// Component dashboard hiển thị menu điều hướng cho người dùng

import React from 'react'
import { Link } from 'react-router-dom'

export const Dashboard = () => {
  return (
    <div className="d-flex flex-column bg-white border-end shadow-sm min-vh-100 p-4" style={{ width: "240px", top: 0, left: 0 }}>
      <h6 className="mb-3">📊 Dashboard</h6>
      <ul className="list-unstyled">
        <li className="mb-2">
          <Link to="/users" className="text-decoration-none d-block">
            👤 User Management
          </Link>
        </li>
        <li>
          <Link to="/products" className="text-decoration-none d-block">
            📦 Product Management
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Dashboard