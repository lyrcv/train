import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { login as loginService } from "../../services/authService";
import { authMessages } from "../../constants/messages/authMessages";
import { validationMessages } from "../../constants/messages/validationMessages";
import "../../assets/styles/Login.scss"

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await loginService(data);

      if (result.success) {
        const userInfo = result.userInfo;

        if (data.remember) {
          localStorage.setItem("userInfo", JSON.stringify(userInfo));
        } else {
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        }

        login(userInfo, data.remember);
        navigate("/users");
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(authMessages.loginFailed);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-100 login-form" style={{ maxWidth: "420px" }}>
      <div className="card shadow border-0">
        <div className="card-body p-4">
          <h3 className="text-center mb-4">{authMessages.loginTitle}</h3>
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">{authMessages.emailLabel}</label>
            <input
              {...register("email", {
                required: validationMessages.required,
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: validationMessages.invalidEmail,
                },
              })}
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder={authMessages.emailPlaceholder}
            />
            <div className="error-text">{errors.email?.message || " "}</div>
          </div>
          {/* Password */}
          <div className="mb-3">
            <label className="form-label">{authMessages.passwordLabel}</label>
            <input
              {...register("password", {
                required: validationMessages.required,
              })}
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder={authMessages.passwordPlaceholder}
            />
            <div className="error-text">{errors.password?.message || " "}</div>
          </div>
          {/* Remember */}
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="remember" {...register("remember")} />
            <label className="form-check-label" htmlFor="remember">{authMessages.rememberMe}</label>
          </div>
          <button className="btn btn-primary w-100">{authMessages.loginButton}</button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
