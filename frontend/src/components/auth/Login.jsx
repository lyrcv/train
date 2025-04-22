// Component trang Login cho người dùng

import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { apiUrl } from "../common/http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import "../../assets/css/Login.scss";

export const Login = () => {
  // Dùng Context để lấy hàm login từ AuthContext
  const { login } = useContext(AuthContext);

  // Khởi tạo useForm từ react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Khởi tạo useNavigate từ react-router-dom dùng để điều hướng trang
  const navigate = useNavigate();

  // Hàm xử lý khi submit form
  const onSubmit = async (data) => {
    // Debug data form 
    console.log(data);

    // Gọi API login
    await fetch(`${apiUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Chuyển đổi data thành JSON
    })
      .then((res) => res.json())
      .then((result) => {
        // Nếu login thành công
        if (parseInt(result.status) === 200) {
          const userInfo = {
            token: result.token,
            id: result.user.id,
            name: result.user.name,
            group_role: result.user.group_role,
          };

          // Xử lí remember me, chọn nhớ lưu local, không chọn lưu session
          if (data.remember) {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          } else {
            sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          }

          // Cập nhật login trong AuthContext
          login(userInfo, data.remember);
          navigate("/users");
        } else {
          // Hiển thị toast báo lỗi
          toast.error(result.message);
        }
      });
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light login-page">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-100 login-form"
        style={{ maxWidth: "420px" }}
      >
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <h3 className="text-center mb-4">Đăng nhập</h3>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                {...register("email", {
                  required: "Email không được để trống.",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Email không hợp lệ.",
                  },
                })}
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Nhập email"
              />
              <div className="error-text">{errors.email?.message || " "}</div>
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Mật khẩu</label>
              <input
                {...register("password", {
                  required: "Mật khẩu không được để trống.",
                })}
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Nhập mật khẩu"
              />
              <div className="error-text">
                {errors.password?.message || " "}
              </div>
            </div>

            {/* Remember me */}
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                {...register("remember")}
              />
              <label className="form-check-label" htmlFor="remember">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button className="btn btn-primary w-100">Đăng nhập</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
