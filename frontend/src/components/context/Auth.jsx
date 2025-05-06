// Context Auth xác thực người dùng, quản lý trạng thái đăng nhập

import { createContext } from "react";
import { useState } from "react";

// Tạo context AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Lấy thông tin người dùng
  const userInfo = () => {
    const local = localStorage.getItem("userInfo");
    const session = sessionStorage.getItem("userInfo");
    return local ? JSON.parse(local) : session ? JSON.parse(session) : null;
  };

  // Khởi tạo state user với thông tin người dùng
  const [user, setUser] = useState(userInfo());

  // Hàm đăng nhập, nhận thông tin người dùng và trạng thái remember
  const login = (user, remember = false) => {
    if (remember) {
      localStorage.setItem("userInfo", JSON.stringify(user));
    } else {
      sessionStorage.setItem("userInfo", JSON.stringify(user));
    }
    // Cập nhật lại state
    setUser(user);
  };

  // Hàm logout xóa thông tin người dùng
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', 
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  
    // Xóa state và local/session storage nếu cần
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    setUser(null);
  };
  

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
