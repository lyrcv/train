export const userServiceMessages = {
    // General
    fetchError: "Không thể tải danh sách người dùng.",
    connectionError: "Lỗi kết nối máy chủ.",
    deleteAdminError: "Không thể xóa người dùng Admin.",
    toggleAdminError: "Không thể khóa/mở tài khoản Admin.",
  
    // Add User
    addUserTitle: "Thêm người dùng mới",
    addUserFailed: "Thêm người dùng thất bại.",
  
    // Update User
    editUserTitle: "Chỉnh sửa người dùng",
    editUserConfirm: "Cập nhật",
    editUserCancel: "Hủy",
    emptyNameWarning: "Tên không được để trống.",
    updateFailed: "Cập nhật thất bại.",
  
    // Delete User
    deleteConfirmTitle: "Xác nhận xóa",
    deleteConfirmText: (name) => `Bạn có chắc chắn muốn xóa người dùng "${name}"?`,
    deleteSuccess: "Đã xóa người dùng.",
    deleteFailed: "Xóa người dùng thất bại.",
    deleteConfirmBtn: "Xóa",
    deleteCancelBtn: "Hủy",
  
    // Toggle User Active
    toggleLockTitle: (isActive) => (isActive ? "Khóa tài khoản?" : "Mở khóa tài khoản?"),
    toggleLockText: (name, isActive) =>
      isActive
        ? `Bạn có chắc chắn muốn khóa "${name}" không?`
        : `Bạn có chắc chắn muốn mở khóa "${name}" không?`,
    toggleLockConfirm: (isActive) => (isActive ? "Khóa" : "Mở khóa"),
    toggleLockCancel: "Hủy",
    toggleFailed: "Thao tác thất bại.",
  };
  