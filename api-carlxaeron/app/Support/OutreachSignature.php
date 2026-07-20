<?php

namespace App\Support;

/**
 * Shared sign-off for outreach, follow-ups, and preview feedback auto-replies.
 */
final class OutreachSignature
{
    public const FB_PROFILE = '61557195950694';

    public const FB_URL = 'https://www.facebook.com/profile.php?id=61557195950694';

    public const PHONE_TEL = '+639625389886';

    public const PHONE_DISPLAY = '+63 962 538 9886';

    public static function facebookContactHtml(): string
    {
        return '<p>You can also message me on <a href="'.self::FB_URL.'">Facebook</a> if that is easier.</p>';
    }

    public static function facebookContactText(): string
    {
        return 'You can also message me on Facebook: facebook.com/profile.php?id='.self::FB_PROFILE."\n";
    }

    public static function html(): string
    {
        return '<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
            .'<a href="https://carlmanuel.com">carlmanuel.com</a> · '
            .'<a href="'.self::FB_URL.'">Facebook</a> · '
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
