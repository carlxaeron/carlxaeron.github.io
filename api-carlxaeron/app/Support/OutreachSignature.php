<?php

namespace App\Support;

/**
 * Shared sign-off constants + text helpers. HTML chrome lives in Blade
 * (`emails.partials.signature`); this class still renders that partial for tests.
 */
final class OutreachSignature
{
    public const FB_PROFILE = '61557195950694';

    public const FB_URL = 'https://www.facebook.com/profile.php?id=61557195950694';

    public const PHONE_TEL = '+639625389886';

    public const PHONE_DISPLAY = '+63 962 538 9886';

    /** Hosted headshot for HTML signature (portfolio static asset). */
    public const PHOTO_URL = 'https://carlmanuel.com/static/images/profile3.jpg';

    public const PHOTO_ALT = 'Carl Louis Manuel';

    /** Display size in email clients (px). */
    public const PHOTO_SIZE = 56;

    public static function facebookContactHtml(): string
    {
        return '<p>You can also message me on <a href="'.self::FB_URL.'">Facebook</a> if that is easier.</p>';
    }

    public static function facebookContactText(): string
    {
        return 'You can also message me on Facebook: facebook.com/profile.php?id='.self::FB_PROFILE."\n";
    }

    public static function html(bool $showFacebookContact = false): string
    {
        return view('emails.partials.signature', [
            'showFacebookContact' => $showFacebookContact,
        ])->render();
    }

    public static function text(bool $showFacebookContact = false): string
    {
        return view('emails.partials.signature-text', [
            'showFacebookContact' => $showFacebookContact,
        ])->render();
    }
}
