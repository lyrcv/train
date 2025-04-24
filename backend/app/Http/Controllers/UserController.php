<?php
// Controller xử lí User Management
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20); // Số bản ghi mỗi trang, mặc định 20
        $currentUserId = Auth::user()->id; // Lấy ID người dùng đang đăng nhập

        $users = User::where('is_delete', 0)
            ->where('id', '!=', $currentUserId) // Không hiển thị người dùng đang đăng nhập
            ->orderBy('created_at', 'desc') // Sắp xếp theo ngày tạo (mới nhất lên đầu)
            ->paginate($perPage);

        return response()->json($users);
    }

    public function search(Request $request)
    {
        $perPage = $request->input('per_page', 20); // Dùng per_page từ request

        $query = User::where('is_delete', 0);

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->has('group') && $request->group != '') {
            $query->where('group_role', $request->group);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('is_active', $request->status);
        }

        $users = $query->paginate($perPage);

        return response()->json($users);
    }


    // Thêm mới người dùng
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'group_role' => 'required|string'
        ], [
            // Tùy chỉnh thông báo lỗi
            'email.email' => 'Email không đúng định dạng.',
            'email.unique' => 'Email được nhập đã đăng kí người dùng.',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => '400',
                'errors' => $validator->errors(),
            ], 400);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        $user->group_role = $request->group_role;
        $user->is_active = $request->has('is_active') ? $request->is_active : 1; // Mặc định là 1 (kích hoạt)
        $user->is_delete = 0; // Mặc định là 0 (chưa xóa)
        $user->last_login_at = null; // Mặc định là null
        $user->last_login_ip = null; // Mặc định là null
        $user->created_at = now(); // Thời gian tạo
        $user->updated_at = now(); // Thời gian cập nhật
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => 'Người dùng đã được thêm thành công.',
            'user' => $user,
        ], 200);
    }

    // Cập nhật thông tin người dùng
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => '404',
                'message' => 'Người dùng không tồn tại.',
            ], 404);
        }

        $user->name = $request->has('name') ? $request->name : $user->name;
        $user->email = $request->has('email') ? $request->email : $user->email;
        $user->group_role = $request->has('group_role') ? $request->group_role : $user->group_role;
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => 'Thông tin người dùng đã được cập nhật.',
            'user' => $user,
        ], 200);
    }

    // Xóa mềm người dùng
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => '404',
                'message' => 'Người dùng không tồn tại.',
            ], 404);
        }

        $user->is_delete = 1; // Đánh dấu đã xóa
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => 'Người dùng đã bị xóa.',
        ], 200);
    }

    // Khóa / Mở khóa tài khoản người dùng
    public function toggleActive($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => '404',
                'message' => 'Người dùng không tồn tại.',
            ], 404);
        }

        // Đảo ngược trạng thái active
        $user->is_active = $user->is_active == 1 ? 0 : 1;
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => $user->is_active ? 'Tài khoản đã được kích hoạt.' : 'Tài khoản đã bị khóa.',
        ], 200);
    }
}
