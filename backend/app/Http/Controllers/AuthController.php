<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        // Kiểm tra dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ], [
            // Tùy chỉnh thông báo lỗi
            'email.required' => __('validation.required', ['attribute' => 'email']),
            'email.email' => __('validation.email', ['attribute' => 'email']),
            'password.required' => __('validation.required', ['attribute' => 'password']),
        ]);

        // Nếu dữ liệu không hợp lệ, trả về lỗi 400 - Bad Request
        if($validator->fails()) {
            return response()->json([
                'status' => '400',
                'message' => __('login.invalid_data'),
                'errors' => $validator->errors(),
            ], 400);
        }

        // Kiểm tra xem người dùng có tồn tại không
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::find(Auth::user()->id);

            // Kiểm tra xem người dùng có bị khóa không
            if ($user->is_active != 1) {
                return response()->json([
                    'status' => '403',
                    'message' => __('login.account_locked'),
                ], 403);
            }

            // Kiểm tra xem người dùng có bị xóa không
            if ($user->is_delete == 1) {
                return response()->json([
                    'status' => '403',
                    'message' => __('login.account_deleted'),
                ], 403);
            }

            // Cập nhật thông tin đăng nhập
            $user->last_login_at = now();
            $user->last_login_ip = $request->ip();
            $user->save();

            // Tạo token cho người dùng
            $token = $user->createToken('auth_token')->plainTextToken;

            // Trả về thông tin người dùng và token
            return response()->json([
                'status' => '200',
                'message' => __('login.login_success'),
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'group_role' => $user->group_role,
                ],
            ], 200);
        } else {
            // Nếu thông tin đăng nhập không đúng, trả về lỗi 401 - Unauthorized
            return response()->json([
                'status' => '401',
                'message' => __('login.login_failed'),
            ], 401);
        }
    }
}
