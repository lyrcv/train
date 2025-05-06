// services/authService.js
import { apiUrl } from "../components/common/http";

export const login = async (data) => {
  try {
    const xsrfToken = document.cookie
    .split("; ")
    .find(row => row.startsWith("XSRF-TOKEN"))
    ?.split("=")[1];

    await fetch("http://localhost:8000/sanctum/csrf-cookie", {
      credentials: "include",
      "X-XSRF-TOKEN": xsrfToken,
    });

    const response = await fetch(`${apiUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok && parseInt(result.status) === 200) {
      return {
        success: true,
        userInfo: {
          token: result.token,
          id: result.user.id,
          name: result.user.name,
          group_role: result.user.group_role,
        },
      };
    } else {
      return {
        success: false,
        message: result.message || "Đăng nhập thất bại",
        errors: result.errors || {},
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
