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
        $perPage = $request->input('per_page', 20); // Số bản ghi mỗi trang
        $currentUserId = Auth::user()->id;

        // Bắt đầu query người dùng (trừ bản thân)
        $query = User::where('is_delete', 0)
            ->where('id', '!=', $currentUserId);

        // Áp dụng các filter nếu có
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        if ($request->filled('group')) {
            $query->where('group_role', $request->group);
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->status);
        }

        // Phân trang + sắp xếp
        $users = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Tạo ETag dựa trên dữ liệu + filter
        $etag = md5(json_encode([
            'data' => $users,
            'filters' => $request->only(['name', 'email', 'group', 'status', 'per_page', 'page'])
        ]));

        if ($request->header('If-None-Match') === $etag) {
            return response('', 304)
                ->header('Cache-Control', 'private, max-age=60, must-revalidate');
        }

        return response()->json($users)
            ->header('ETag', $etag)
            ->header('Cache-Control', 'private, max-age=60, must-revalidate');
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
            'name.required' => __('validation.required', ['attribute' => 'Tên']),
            'email.required' => __('validation.required', ['attribute' => 'Email']),
            'email.email' => __('validation.email', ['attribute' => 'Email']),
            'email.unique' => __('validation.unique', ['attribute' => 'Email']),
            'password.required' => __('validation.required', ['attribute' => 'Mật khẩu']),
            'password.min' => __('validation.min.string', ['attribute' => 'Mật khẩu', 'min' => 6]),
            'group_role.required' => __('validation.required', ['attribute' => 'Vai trò']),
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
            'message' => __('user.created_success'),
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
                'message' =>  __('user.not_found'),
            ], 404);
        }

        $user->name = $request->has('name') ? $request->name : $user->name;
        $user->email = $request->has('email') ? $request->email : $user->email;
        $user->group_role = $request->has('group_role') ? $request->group_role : $user->group_role;
        $user->save();

        return response()->json([
            'status' => '200',
            'message' =>  __('user.updated_success'),
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
                'message' => __('user.not_found'),
            ], 404);
        }

        $user->is_delete = 1; // Đánh dấu đã xóa
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => __('user.deleted_success'),
        ], 200);
    }

    // Khóa / Mở khóa tài khoản người dùng
    public function toggleActive($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => '404',
                'message' => __('user.not_found'),
            ], 404);
        }

        // Đảo ngược trạng thái active
        $user->is_active = $user->is_active == 1 ? 0 : 1;
        $user->save();

        return response()->json([
            'status' => '200',
            'message' => $user->is_active ? __('user.activated') : __('user.deactivated'),
        ], 200);
    }
}
