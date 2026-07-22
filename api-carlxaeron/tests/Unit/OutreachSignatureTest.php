<?php

namespace Tests\Unit;

use App\Support\OutreachSignature;
use Tests\TestCase;

class OutreachSignatureTest extends TestCase
{
    public function test_html_signature_includes_hosted_headshot(): void
    {
        $html = OutreachSignature::html();

        $this->assertStringContainsString(OutreachSignature::PHOTO_URL, $html);
        $this->assertStringContainsString('alt="Carl Louis Manuel"', $html);
        $this->assertStringContainsString('width="56"', $html);
        $this->assertStringContainsString('border-radius:50%', $html);
        $this->assertStringContainsString('Carl Louis Manuel', $html);
        $this->assertStringContainsString('+63 962 538 9886', $html);
    }

    public function test_text_signature_has_no_image_requirement(): void
    {
        $text = OutreachSignature::text();

        $this->assertStringNotContainsString('profile3.jpg', $text);
        $this->assertStringContainsString('Carl Louis Manuel', $text);
        $this->assertStringContainsString('info@carlmanuel.com', $text);
    }

    public function test_html_signature_uses_blade_partial(): void
    {
        $html = OutreachSignature::html(true);

        $this->assertStringContainsString('message me on', strtolower($html));
        $this->assertStringContainsString('#00A862', $html);
    }
}
