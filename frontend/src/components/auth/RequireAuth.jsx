// Chặn người dùng truy cập vào các trang yêu cầu xác thực nếu chưa đăng nhập

import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
