<?php

namespace Tests\Feature;

use App\Mail\AgreementSignRequestMail;
use App\Mail\AgreementSignedMail;
use App\Models\ServiceAgreement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceAgreementApiTest extends TestCase
{
    use RefreshDatabase;

    private const ADMIN_EMAIL = 'admin@example.com';

    private const ADMIN_PASSWORD = 'secret-password';

    private const SAMPLE_HTML = '<article><h1>Service Agreement</h1><p>Terms for Demo Co.</p></article>';

    private const SAMPLE_SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();

        User::query()->create([
            'name' => 'Admin',
            'email' => self::ADMIN_EMAIL,
            'password' => Hash::make(self::ADMIN_PASSWORD),
        ]);

        config([
            'portfolio.mail_to' => 'info@carlmanuel.com',
            'portfolio.mail_bcc' => 'info@carlmanuel.com',
        ]);
    }

    private function actingAsAdmin(): void
    {
        Sanctum::actingAs(
            User::query()->where('email', self::ADMIN_EMAIL)->firstOrFail(),
            ['*']
        );
    }

    /** @return array<string, mixed> */
    private function createPayload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'demo-client',
            'businessName' => 'Demo Co',
            'clientEmail' => 'client@example.com',
            'clientName' => 'Jane Client',
            'formJson' => [
                'businessName' => 'Demo Co',
                'websiteOnlyFee' => '15000',
            ],
            'filledHtml' => self::SAMPLE_HTML,
        ], $overrides);
    }

    public function test_create_requires_auth(): void
    {
        $this->postJson('/admin/agreements', $this->createPayload())
            ->assertUnauthorized();
    }

    public function test_create_sends_email_and_returns_sign_url(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $response = $this->postJson('/admin/agreements', $this->createPayload())
            ->assertOk()
            ->assertJsonPath('status', 200)
            ->assertJsonPath('data.slug', 'demo-client')
            ->assertJsonPath('data.status', 'sent')
            ->assertJsonPath('data.clientEmail', 'client@example.com')
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'token',
                    'signUrl',
                    'sentAt',
                    'expiresAt',
                    'filledHtml',
                    'formJson',
                ],
            ]);

        $token = $response->json('data.token');
        $this->assertSame(64, strlen($token));
        $this->assertSame(
            'https://carlmanuel.com/?sign='.$token,
            $response->json('data.signUrl'),
        );

        $this->assertDatabaseHas('service_agreements', [
            'slug' => 'demo-client',
            'client_email' => 'client@example.com',
            'status' => 'sent',
        ]);

        Mail::assertSent(AgreementSignRequestMail::class, function (AgreementSignRequestMail $mail) use ($token) {
            return str_contains($mail->mailSubject, 'Demo Co')
                && str_contains($mail->htmlBody, '?sign='.$token);
        });
    }

    public function test_create_validates_required_fields(): void
    {
        $this->actingAsAdmin();

        $this->postJson('/admin/agreements', [
            'slug' => 'x',
            'businessName' => 'Biz',
            'clientEmail' => 'not-an-email',
            'filledHtml' => '<p>x</p>',
            'formJson' => [],
        ])
            ->assertStatus(400)
            ->assertJsonPath('message', 'Invalid clientEmail');
    }

    public function test_public_get_marks_viewed(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $token = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.token');

        $this->getJson('/agreements/'.$token)
            ->assertOk()
            ->assertJsonPath('data.status', 'viewed')
            ->assertJsonPath('data.signable', true)
            ->assertJsonPath('data.filledHtml', self::SAMPLE_HTML)
            ->assertJsonMissingPath('data.clientIp');

        $this->assertDatabaseHas('service_agreements', [
            'token' => $token,
            'status' => 'viewed',
        ]);
    }

    public function test_public_sign_once_and_notifies_admin(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $token = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.token');

        Mail::fake();

        $this->postJson('/agreements/'.$token.'/sign', [
            'signatoryName' => 'Jane Client',
            'signatoryTitle' => 'Owner',
            'signedAt' => '2026-07-20',
            'signatureData' => self::SAMPLE_SIGNATURE,
        ])
            ->assertOk()
            ->assertJsonPath('data.status', 'signed')
            ->assertJsonPath('data.signable', false)
            ->assertJsonPath('data.clientSignatoryName', 'Jane Client')
            ->assertJsonPath('data.clientSignatureData', self::SAMPLE_SIGNATURE);

        $this->assertDatabaseHas('service_agreements', [
            'token' => $token,
            'status' => 'signed',
            'client_signatory_title' => 'Owner',
        ]);

        Mail::assertSent(AgreementSignedMail::class, function (AgreementSignedMail $mail) {
            return str_starts_with($mail->mailSubject, 'Signed:')
                && $mail->replyToEmail === 'client@example.com'
                && str_contains($mail->htmlBody, 'Jane Client');
        });
    }

    public function test_public_sign_rejects_second_attempt(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $token = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.token');

        $this->postJson('/agreements/'.$token.'/sign', [
            'signatoryName' => 'Jane Client',
            'signatureData' => self::SAMPLE_SIGNATURE,
        ])->assertOk();

        $this->postJson('/agreements/'.$token.'/sign', [
            'signatoryName' => 'Someone Else',
            'signatureData' => self::SAMPLE_SIGNATURE,
        ])
            ->assertStatus(409)
            ->assertJsonPath('message', 'Agreement already signed');
    }

    public function test_public_get_and_sign_reject_expired(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $token = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.token');

        ServiceAgreement::query()->where('token', $token)->update([
            'expires_at' => now()->subDay(),
        ]);

        $this->getJson('/agreements/'.$token)
            ->assertStatus(410)
            ->assertJsonPath('message', 'This agreement link has expired');

        $this->postJson('/agreements/'.$token.'/sign', [
            'signatoryName' => 'Jane Client',
            'signatureData' => self::SAMPLE_SIGNATURE,
        ])
            ->assertStatus(410)
            ->assertJsonPath('message', 'This agreement link has expired');

        $this->assertDatabaseHas('service_agreements', [
            'token' => $token,
            'status' => 'expired',
        ]);
    }

    public function test_public_get_and_sign_reject_revoked(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $id = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.id');
        $token = ServiceAgreement::query()->findOrFail($id)->token;

        $this->postJson('/admin/agreements/'.$id.'/revoke')
            ->assertOk()
            ->assertJsonPath('data.status', 'revoked');

        $this->getJson('/agreements/'.$token)
            ->assertStatus(410)
            ->assertJsonPath('message', 'This agreement link has been revoked');

        $this->postJson('/agreements/'.$token.'/sign', [
            'signatoryName' => 'Jane Client',
            'signatureData' => self::SAMPLE_SIGNATURE,
        ])
            ->assertStatus(410);
    }

    public function test_admin_list_and_show(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $id = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.id');

        $this->getJson('/admin/agreements?status=sent')
            ->assertOk()
            ->assertJsonPath('data.pagination.total', 1)
            ->assertJsonPath('data.items.0.id', $id);

        $this->getJson('/admin/agreements/'.$id)
            ->assertOk()
            ->assertJsonPath('data.id', $id)
            ->assertJsonPath('data.businessName', 'Demo Co');
    }

    public function test_admin_resend(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $id = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.id');

        Mail::fake();

        $this->postJson('/admin/agreements/'.$id.'/resend')
            ->assertOk()
            ->assertJsonPath('data.status', 'sent');

        Mail::assertSent(AgreementSignRequestMail::class);
    }

    public function test_signed_agreement_public_get_returns_read_only_copy(): void
    {
        Mail::fake();
        $this->actingAsAdmin();

        $token = $this->postJson('/admin/agreements', $this->createPayload())
            ->json('data.token');

        $this->postJson('/agreements/'.$token.'/sign', [
            'signatoryName' => 'Jane Client',
            'signatureData' => self::SAMPLE_SIGNATURE,
        ])->assertOk();

        $this->getJson('/agreements/'.$token)
            ->assertOk()
            ->assertJsonPath('data.status', 'signed')
            ->assertJsonPath('data.signable', false)
            ->assertJsonPath('data.clientSignatureData', self::SAMPLE_SIGNATURE);
    }
}
