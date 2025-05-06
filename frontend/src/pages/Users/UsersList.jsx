import React, { useState, useEffect } from "react";
import LoadingOverlay from "../../components/common/LoadingOverlay";
import { Layout } from "../../components/layout/Layout";
import { toast } from "react-toastify";
import {
  fetchUsers,
  addUser,
  updateUser,
  deleteUser,
  toggleUserActive,
} from "../../services/userService";
import UserFilter from "../../components/ui/UserFilter";
import UserTable from "../../components/common/UserTable";
import PaginationControl from "../../components/ui/PaginationControl";
import { userListMessages } from "../../constants/messages/userListMessages";

export const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 20,
  });
  const [perPage, setPerPage] = useState(20);
  const [search, setSearch] = useState({
    name: "",
    email: "",
    group: "",
    status: "",
  });

  const loadUsers = async (page = 1) => {
    setIsLoading(true);
    let isCache = false; // Biến theo dõi xem có phải từ cache
  
    try {
      const result = await fetchUsers(search, perPage, page);
  
      if (result.fromCache) {
        isCache = true; // Dữ liệu lấy từ cache
        console.log("Dữ liệu được lấy từ cache");
        toast.info("⚡ Dữ liệu được lấy từ cache", {
          position: "bottom-right",  // Đảm bảo vị trí hiển thị đúng
          autoClose: 5000,           // Tự động đóng sau 5 giây
          hideProgressBar: true,     // Ẩn thanh tiến độ
        });
      } else {
        setUsers(result.data);
        setPagination({
          currentPage: result.current_page,
          totalPages: result.last_page,
          perPage,
        });
      }
  
      // Nếu lấy từ cache, bạn có thể hiển thị thông báo
      if (isCache) {
        console.log("Dữ liệu được lấy từ cache");       
      }
    } catch {
      toast.error(userListMessages.errorLoad);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    const offset = (pagination.currentPage - 1) * pagination.perPage;
    const newPage = Math.floor(offset / perPage) + 1;
    loadUsers(newPage);
  }, [perPage]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <main className="user-list container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="title">{userListMessages.pageTitle}</h3>
          <button
            className="btn btn-success"
            onClick={() => addUser(setUsers, pagination, loadUsers)}
          >
            <i className="fas fa-plus-circle me-2"></i> {userListMessages.addButton}
          </button>
        </div>

        <UserFilter
          search={search}
          onChange={handleSearchChange}
          onSearch={() => loadUsers(1)}
          onClear={() => {
            setSearch({ name: "", email: "", group: "", status: "" });
            loadUsers(1);
          }}
        />

        <div className="mb-3">
          {userListMessages.perPagePrefix}
          <select
            className="mx-2"
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
          >
            {[5, 10, 15, 20, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {userListMessages.perPageSuffix}
        </div>

        <LoadingOverlay loading={isLoading} message={userListMessages.loadingMessage}>
          <UserTable
            users={users}
            pagination={pagination}
            perPage={perPage}
            onEdit={(user) => updateUser(user, loadUsers, pagination)}
            onDelete={(id, name, role) =>
              deleteUser(id, name, role, loadUsers, pagination)
            }
            onToggleActive={(id, isActive, name, role) =>
              toggleUserActive(id, isActive, name, role, loadUsers, pagination)
            }
          />
        </LoadingOverlay>

        <PaginationControl
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={loadUsers}
        />
      </main>
    </Layout>
  );
};

export default UserList;
