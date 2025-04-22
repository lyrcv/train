<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('product_id', 10)->primary(); // Mã sản phẩm (khóa chính, tự sinh)
            $table->string('product_name');
            $table->decimal('product_price', 12, 2);
            $table->unsignedInteger('quantity')->default(0);
            $table->text('description')->nullable();
            $table->string('product_image')->nullable();
            $table->enum('is_sales', ['Đang bán', 'Ngừng bán', 'Hết hàng'])->default('Đang bán');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
