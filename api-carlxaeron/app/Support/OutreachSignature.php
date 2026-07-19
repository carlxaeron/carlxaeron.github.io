<?php

namespace App\Support;

/**
 * Shared sign-off for outreach, follow-ups, and preview feedback auto-replies.
 */
final class OutreachSignature
{
    public const FB_PROFILE = '61557195950694';

    public const PHONE_TEL = '+639625389886';

    public const PHONE_DISPLAY = '+63 962 538 9886';

    public static function html(): string
    {
        return '<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
            .'<a href="https://carlmanuel.com">carlmanuel.com</a> · '
            .'<a href="https://www.facebook.com/profile.php?id='.self::FB_PROFILE.'">Facebook</a> · '
            .'<a href="tel:'.self::PHONE_TEL.'">'.self::PHONE_DISPLAY.'</a> · '
            .'info@carlmanuel.com</p>';
    }

    public static function text(): string
    {
        return 'Carl Louis Manuel'
            ."\ncarlmanuel.com · facebook.com/profile.php?id=".self::FB_PROFILE
            .' · '.self::PHONE_DISPLAY
            .' · info@carlmanuel.com';
    }
}
