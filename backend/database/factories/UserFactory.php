<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'verify_email'     => fake()->optional()->safeEmail(),
            'is_active'        => fake()->boolean(90) ? 1 : 0,
            'is_delete'        => 0, // chưa bị xóa
            'group_role'       => fake()->randomElement(['admin', 'reviewer', 'editor']),
            'last_login_at'    => fake()->optional()->dateTimeThisYear(),
            'last_login_ip'    => fake()->optional()->ipv4(),
            'created_at'       => now(),
            'updated_at'       => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
