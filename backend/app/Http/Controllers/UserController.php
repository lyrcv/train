<?php
// Controller xử lí User Management
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    //  Hiển thị danh sách người dùng (chưa bị xóa mềm)
    public function index(Request $request)
    {
        $users = User::where('is_delete', 0)
            ->paginate(20); //phân trang mặc định 20 bản ghi
        return response()->json($users);
    }

    // Tìm kiếm người dùng
    public function search(Request $request)
    {
        $query = User::where('is_delete', 0);

        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->has('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }

        $users = $query->paginate(20);
        return response()->json($users);
    }

    // Thêm mới người dùng
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
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
