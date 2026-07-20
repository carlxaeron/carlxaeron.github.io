<?php

declare(strict_types=1);

/**
 * Shared outreach sign-off and Facebook contact (hosting-php).
 */
function outreach_fb_profile_id(): string
{
    return '61557195950694';
}

function outreach_fb_url(): string
{
    return 'https://www.facebook.com/profile.php?id=' . outreach_fb_profile_id();
}

function outreach_phone_tel(): string
{
    return '+639625389886';
}

function outreach_phone_display(): string
{
    return '+63 962 538 9886';
}

function outreach_facebook_contact_html(): string
{
    return '<p>You can also message me on <a href="' . h(outreach_fb_url()) . '">Facebook</a> if that is easier.</p>';
}

function outreach_facebook_contact_text(): string
{
    return 'You can also message me on Facebook: facebook.com/profile.php?id=' . outreach_fb_profile_id() . "\n";
}

function outreach_signature_html(): string
{
    return '<p>Best regards,<br><strong>Carl Louis Manuel</strong><br>'
        . '<a href="https://carlmanuel.com">carlmanuel.com</a> · '
        . '<a href="' . h(outreach_fb_url()) . '">Facebook</a> · '
        . '<a href="tel:' . outreach_phone_tel() . '">' . outreach_phone_display() . '</a> · '
        . 'info@carlmanuel.com</p>';
}

function outreach_signature_text(): string
{
    return 'Carl Louis Manuel'
        . "\ncarlmanuel.com · facebook.com/profile.php?id=" . outreach_fb_profile_id()
        . ' · ' . outreach_phone_display()
        . ' · info@carlmanuel.com';
}
