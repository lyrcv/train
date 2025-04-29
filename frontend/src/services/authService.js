// services/authService.js
import { apiUrl } from "../components/common/http";

export const login = async (data) => {
  try {
    const response = await fetch(`${apiUrl}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
