<?php

namespace Tests\Feature;

use App\Mail\OutreachProspectMail;
use App\Models\OutreachJob;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class OutreachApiTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'test-outreach-secret';

    protected function setUp(): void
    {
        parent::setUp();
        config(['portfolio.outreach_secret' => self::SECRET]);
    }

    public function test_outreach_schedule_rejects_invalid_secret(): void
    {
        $this->postJson('/outreachSchedule', [
            'secret' => 'wrong',
            'slug' => 'demo',
            'businessName' => 'Demo Co',
            'contactName' => 'Jane',
            'contactEmail' => 'jane@example.com',
            'previewUrl' => 'https://carlmanuel.com/?preview=demo',
        ])
            ->assertStatus(401)
            ->assertJsonPath('message', 'Unauthorized');
    }

    public function test_outreach_schedule_accepts_header_secret(): void
    {
        Mail::fake();

        $this->withHeader('X-Outreach-Secret', self::SECRET)
            ->postJson('/outreachSchedule', [
                'slug' => 'demo-client',
                'businessName' => 'Demo Client',
                'contactName' => 'Jane Doe',
                'contactEmail' => 'jane@example.com',
                'previewUrl' => 'https://carlmanuel.com/?preview=demo-client',
                'cadence' => '3d1w',
                'sendInitial' => false,
                'autoFollowUp' => true,
                'maxFollowUps' => 4,
            ])
            ->assertOk()
            ->assertJsonPath('message', 'Outreach scheduled')
            ->assertJsonPath('data.slug', 'demo-client')
            ->assertJsonPath('data.cadence', '3d1w')
            ->assertJsonPath('data.status', 'waiting_followup');

        $this->assertDatabaseHas('outreach_jobs', [
            'slug' => 'demo-client',
            'contact_email' => 'jane@example.com',
            'auto_followup' => true,
            'max_followups' => 4,
            'status' => 'waiting_followup',
        ]);

        Mail::assertNothingSent();
    }

    public function test_outreach_schedule_send_initial_sends_mail_and_queues_followup(): void
    {
        Mail::fake();

        $this->postJson('/outreachSchedule', [
            'secret' => self::SECRET,
            'slug' => 'send-now',
            'businessName' => 'Send Now Co',
            'contactName' => 'Alex',
            'contactEmail' => 'alex@example.com',
            'previewUrl' => 'https://carlmanuel.com/?preview=send-now',
            'packageName' => 'Starter',
            'quotedAmount' => '₱15,000',
            'timeline' => '2 weeks',
            'cadence' => '3d1w',
            'sendInitial' => true,
            'autoFollowUp' => true,
            'maxFollowUps' => 4,
        ])
            ->assertOk()
            ->assertJsonPath('data.sendInitial', true)
            ->assertJsonPath('data.status', 'sent')
            ->assertJsonStructure(['data' => ['nextFollowUpAt']]);

        Mail::assertSent(OutreachProspectMail::class, function (OutreachProspectMail $mail) {
            return str_contains($mail->mailSubject, 'Send Now Co');
        });
        $this->assertDatabaseHas('outreach_jobs', [
            'slug' => 'send-now',
            'status' => 'sent',
            'auto_followup' => true,
        ]);
    }

    public function test_outreach_schedule_validates_required_fields(): void
    {
        $this->postJson('/outreachSchedule', [
            'secret' => self::SECRET,
            'slug' => 'incomplete',
        ])
            ->assertStatus(400)
            ->assertJsonPath('message', 'Missing required fields');
    }

    public function test_outreach_pause_stops_followups(): void
    {
        OutreachJob::query()->create([
            'slug' => 'pause-me',
            'business_name' => 'Pause Me',
            'contact_name' => 'Pat',
            'contact_email' => 'pat@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=pause-me',
            'auto_followup' => true,
            'status' => 'sent',
            'next_follow_up_at' => now()->addDays(3),
        ]);

        $this->postJson('/outreachPause', [
            'secret' => self::SECRET,
            'slug' => 'pause-me',
            'contactEmail' => 'pat@example.com',
        ])
            ->assertOk()
            ->assertJsonPath('message', 'Outreach paused')
            ->assertJsonPath('data.updated', 1);

        $this->assertDatabaseHas('outreach_jobs', [
            'slug' => 'pause-me',
            'auto_followup' => false,
            'status' => 'paused',
            'next_follow_up_at' => null,
        ]);
    }

    public function test_outreach_pause_rejects_invalid_secret(): void
    {
        $this->postJson('/outreachPause', [
            'secret' => 'nope',
            'slug' => 'any',
        ])
            ->assertStatus(401)
            ->assertJsonPath('message', 'Unauthorized');
    }
}
