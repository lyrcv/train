<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $fillable = [
        'product_id',
        'product_name',
        'product_price',
        'quantity',
        'description',
        'product_image',
        'is_sales'
    ];
}
