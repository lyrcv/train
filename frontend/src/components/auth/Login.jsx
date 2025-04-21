import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { apiUrl } from "../common/http";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export const Login = () => {
  const {login} = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);

    await fetch(`${apiUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((result) => {
        if (parseInt(result.status) === 200) {
            const userInfo = {
                token: result.token,
                id: result.user.id,
                name: result.user.name,
            }

            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            login(userInfo);
            navigate('/users');
        } else {
          toast.error(result.message);
        }
      });
  };

  return (
    <div className="container d-flex justify-content-center py-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card shadow border-0 login">
          <div className="card-body p-4">
            <h3 className="text-center">Đăng nhập</h3>

            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Email
              </label>
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
              {errors.email && (
                <p className="invalid-feedback">{errors.email?.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="" className="form-label">
                Mật khẩu
              </label>
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
              {errors.password && (
                <p className="invalid-feedback">{errors.password?.message}</p>
              )}
            </div>

            <button className="btn btn-secondary">Đăng nhập</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;
