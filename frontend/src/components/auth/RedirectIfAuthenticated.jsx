// Chặn đăng nhập lại vào trang người dùng nếu đã đăng nhập

import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export const RedirectIfAuthenticated = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/users" replace />;
  }

  return children;
};


