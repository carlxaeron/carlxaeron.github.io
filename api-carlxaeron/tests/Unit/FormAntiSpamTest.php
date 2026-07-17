<?php

namespace Tests\Unit;

use App\Support\FormAntiSpam;
use Illuminate\Http\Request;
use Tests\TestCase;

class FormAntiSpamTest extends TestCase
{
    public function test_rejects_filled_honeypot(): void
    {
        $request = Request::create('/contact', 'POST', [
            'website' => 'http://spam.example',
            'formOpenedAt' => time() - 10,
        ]);

        $this->assertSame('spam', FormAntiSpam::rejectReason($request));
    }

    public function test_rejects_too_fast(): void
    {
        $request = Request::create('/contact', 'POST', [
            'website' => '',
            'formOpenedAt' => time(),
        ]);

        $this->assertSame('spam', FormAntiSpam::rejectReason($request));
    }

    public function test_rejects_missing_opened_at(): void
    {
        $request = Request::create('/contact', 'POST', [
            'website' => '',
        ]);

        $this->assertSame('spam', FormAntiSpam::rejectReason($request));
    }

    public function test_accepts_valid_human_timing(): void
    {
        $request = Request::create('/contact', 'POST', [
            'website' => '',
            'formOpenedAt' => time() - 5,
        ]);

        $this->assertNull(FormAntiSpam::rejectReason($request));
    }
}
