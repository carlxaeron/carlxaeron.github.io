<?php

namespace Tests\Feature;

use App\Mail\OutreachProspectMail;
use App\Models\OutreachJob;
use App\Services\OutreachFollowupProcessor;
use App\Services\PushNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class OutreachFollowupsCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_command_processes_due_followups(): void
    {
        Mail::fake();

        OutreachJob::query()->create([
            'slug' => 'due-client',
            'business_name' => 'Due Client',
            'contact_name' => 'Dana',
            'contact_email' => 'dana@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=due-client',
            'package_name' => 'Starter',
            'quoted_amount' => '₱15,000',
            'cadence' => '3d1w',
            'auto_followup' => true,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
            'next_follow_up_at' => now('UTC')->subHour(),
        ]);

        $this->mock(PushNotificationService::class, function ($mock): void {
            $mock->shouldReceive('sendToAdmins')->once()->andReturn(1);
        });

        $exit = Artisan::call('outreach:followups');
        $this->assertSame(0, $exit);

        Mail::assertSent(OutreachProspectMail::class, function (OutreachProspectMail $mail) {
            return str_contains($mail->mailSubject, 'Due Client')
                && str_contains($mail->htmlBody, '#00473e');
        });

        $this->assertDatabaseHas('outreach_jobs', [
            'slug' => 'due-client',
            'follow_up_count' => 1,
            'status' => 'followup_sent',
        ]);
    }

    public function test_processor_skips_future_jobs(): void
    {
        Mail::fake();

        OutreachJob::query()->create([
            'slug' => 'future-client',
            'business_name' => 'Future Client',
            'contact_name' => 'Fran',
            'contact_email' => 'fran@example.com',
            'preview_url' => 'https://carlmanuel.com/?preview=future-client',
            'cadence' => '3d1w',
            'auto_followup' => true,
            'max_followups' => 4,
            'follow_up_count' => 0,
            'status' => 'sent',
            'next_follow_up_at' => now('UTC')->addDays(2),
        ]);

        $summary = app(OutreachFollowupProcessor::class)->process();
        $this->assertSame(0, $summary['processed']);
        $this->assertSame(0, $summary['sent']);
        Mail::assertNothingSent();
    }
}
