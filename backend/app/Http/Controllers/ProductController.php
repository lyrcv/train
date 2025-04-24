<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    // Lấy danh sách sản phẩm
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 20); // Mặc định 20 sản phẩm mỗi trang

        $products = Product::orderBy('created_at', 'desc') // Sắp xếp sản phẩm mới nhất trước
            ->paginate($perPage);

        return response()->json($products);
    }

    // Tìm kiếm sản phẩm
    public function search(Request $request)
    {
        $query = Product::query();

        if ($request->has('product_name')) {
            $query->where('product_name', 'like', '%' . $request->product_name . '%');
        }

        if ($request->has('product_price')) {
            $query->where('product_price', $request->product_price);
        }

        if ($request->has('is_sales')) {
            $query->where('is_sales', $request->is_sales);
        }

        // Sắp xếp và phân trang
        $products = $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 20));

        return response()->json($products);
    }

    // Thêm mới sản phẩm
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'product_price' => 'required|numeric',
            'quantity' => 'required|integer',
            'description' => 'nullable|string',
            'product_image' => 'nullable|string',
            'is_sales' => 'required|in:Đang bán,Ngừng bán,Hết hàng',
        ]);

        $product = new Product();
        $product->product_name = $request->product_name;
        $product->product_price = $request->product_price;
        $product->quantity = $request->quantity;
        $product->description = $request->description;
        $product->product_image = $request->product_image;
        $product->is_sales = $request->is_sales;
        $product->save();

        return response()->json([
            'status' => '200',
            'message' => 'Sản phẩm đã được thêm thành công.',
            'product' => $product,
        ]);
    }
}
