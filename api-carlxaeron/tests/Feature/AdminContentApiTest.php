<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminContentApiTest extends TestCase
{
    use RefreshDatabase;

    private const ADMIN_EMAIL = 'admin@example.com';

    private const ADMIN_PASSWORD = 'secret-password';

    protected function setUp(): void
    {
        parent::setUp();

        User::query()->create([
            'name' => 'Admin',
            'email' => self::ADMIN_EMAIL,
            'password' => Hash::make(self::ADMIN_PASSWORD),
        ]);
    }

    public function test_public_content_returns_static_when_empty(): void
    {
        $this->getJson('/content/hero')
            ->assertOk()
            ->assertJsonPath('data.section', 'hero')
            ->assertJsonPath('data.content', null)
            ->assertJsonPath('data.source', 'static');
    }

    public function test_admin_can_save_and_read_content(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $payload = [
            'eyebrow' => 'Test eyebrow',
            'subheadline' => 'Test subheadline',
        ];

        $this->putJson('/admin/content/hero', ['content' => $payload])
            ->assertOk()
            ->assertJsonPath('data.section', 'hero')
            ->assertJsonPath('data.content.eyebrow', 'Test eyebrow')
            ->assertJsonPath('data.source', 'cms');

        $this->getJson('/admin/content/hero')
            ->assertOk()
            ->assertJsonPath('data.content.eyebrow', 'Test eyebrow')
            ->assertJsonPath('data.source', 'cms');

        $this->getJson('/content/hero')
            ->assertOk()
            ->assertJsonPath('data.content.eyebrow', 'Test eyebrow')
            ->assertJsonPath('data.source', 'cms');
    }

    public function test_invalid_section_returns_404(): void
    {
        $this->getJson('/content/not-a-section')
            ->assertStatus(404);

        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->putJson('/admin/content/not-a-section', ['content' => []])
            ->assertStatus(404);
    }

    public function test_put_requires_auth(): void
    {
        $this->putJson('/admin/content/hero', ['content' => ['eyebrow' => 'x']])
            ->assertUnauthorized();
    }

    public function test_skills_must_be_array(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );

        $this->putJson('/admin/content/skills', ['content' => ['not' => 'list']])
            ->assertStatus(400)
            ->assertJsonPath('message', 'skills must be a JSON array');
    }
}
