import { apiUrl } from "../components/common/http";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { userServiceMessages } from "../constants/messages/userServiceMessages";

let lastEtag = null; 

export const fetchUsers = async (search, perPage, page) => {
  const query = new URLSearchParams({
    page,
    per_page: perPage,
    name: search.name,
    email: search.email,
    group: search.group,
    status: search.status,
  }).toString();

  const headers = {
    Accept: "application/json",
  };

  // Gửi ETag nếu có
  if (lastEtag) {
    headers['If-None-Match'] = lastEtag;
  }

  await fetch("http://localhost:8000/sanctum/csrf-cookie", {
    credentials: "include",
  });

  const response = await fetch(`${apiUrl}users?${query}`, {
    headers,
    credentials: 'include',
  });

  if (response.status === 304) {
    return { fromCache: true }; // Không có thay đổi
  }

  if (!response.ok) throw new Error(userServiceMessages.fetchError);

  // Lưu lại ETag mới
  lastEtag = response.headers.get("ETag");

  return await response.json();
};

export const addUser = (setUsers, pagination, reload) => {
  Swal.fire({
    title: userServiceMessages.addUserTitle,
    html: `...`, // giữ nguyên
    preConfirm: () => {
      // giữ nguyên logic xử lý
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(`${apiUrl}users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(result.value),
        });

        const data = await res.json();
        if (!res.ok) {
          if (data?.errors) {
            const errorText = Object.values(data.errors).flat().join("<br>");
            Swal.fire({ title: "Lỗi", html: errorText, icon: "error" });
          } else {
            toast.error(userServiceMessages.addUserFailed);
          }
          return;
        }

        toast.success(data.message);
        reload(pagination.currentPage);
      } catch {
        toast.error(userServiceMessages.connectionError);
      }
    }
  });
};

export const updateUser = (user, reload, pagination) => {
  Swal.fire({
    title: userServiceMessages.editUserTitle,
    html: `
      <input id="swal-name" class="swal2-input" placeholder="Tên" value="${user.name}">
      <input id="swal-email" class="swal2-input" value="${user.email}" disabled>
      <select id="swal-role" class="swal2-input" disabled>
        <option value="admin" ${user.group_role === "admin" ? "selected" : ""}>Admin</option>
        <option value="editor" ${user.group_role === "editor" ? "selected" : ""}>Editor</option>
        <option value="reviewer" ${user.group_role === "reviewer" ? "selected" : ""}>Reviewer</option>
      </select>
    `,
    showCancelButton: true,
    confirmButtonText: userServiceMessages.editUserConfirm,
    cancelButtonText: userServiceMessages.editUserCancel,
    preConfirm: () => {
      const name = document.getElementById("swal-name").value;
      if (!name) {
        Swal.showValidationMessage(userServiceMessages.emptyNameWarning);
        return false;
      }
      return { name };
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(`${apiUrl}users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(result.value),
        });

        const data = await res.json();
        if (!res.ok) throw new Error();

        toast.success(data.message);
        reload(pagination.currentPage);
      } catch {
        toast.error(userServiceMessages.updateFailed);
      }
    }
  });
};

export const deleteUser = (id, name, role, reload, pagination) => {
  if (role === "admin") {
    toast.error(userServiceMessages.deleteAdminError);
    return;
  }

  Swal.fire({
    title: userServiceMessages.deleteConfirmTitle,
    text: userServiceMessages.deleteConfirmText(name),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: userServiceMessages.deleteConfirmBtn,
    cancelButtonText: userServiceMessages.deleteCancelBtn,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(`${apiUrl}users/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!res.ok) throw new Error();
        toast.success(userServiceMessages.deleteSuccess);
        reload(pagination.currentPage);
      } catch {
        toast.error(userServiceMessages.deleteFailed);
      }
    }
  });
};

export const toggleUserActive = (id, isActive, name, role, reload, pagination) => {
  if (role === "admin") {
    toast.error(userServiceMessages.toggleAdminError);
    return;
  }

  Swal.fire({
    title: userServiceMessages.toggleLockTitle(isActive),
    text: userServiceMessages.toggleLockText(name, isActive),
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: userServiceMessages.toggleLockConfirm(isActive),
    cancelButtonText: userServiceMessages.toggleLockCancel,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(`${apiUrl}users/toggle-active/${id}`, {
          method: "PUT",
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error();

        toast.success(data.message);
        reload(pagination.currentPage);
      } catch {
        toast.error(userServiceMessages.toggleFailed);
      }
    }
  });
};
