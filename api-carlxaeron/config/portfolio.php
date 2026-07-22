<?php

return [

    'mail_to' => env('MAIL_TO', 'info@carlmanuel.com,carllouismanuel09@gmail.com'),

    'client_sites_count' => (int) env('CLIENT_SITES_COUNT', 11),

    'analytics_exclude_ip_hashes' => env('ANALYTICS_EXCLUDE_IP_HASHES', ''),

    'analytics_exclude_visitor_ids' => env('ANALYTICS_EXCLUDE_VISITOR_IDS', ''),

    'admin_email' => env('ADMIN_EMAIL', ''),

    'admin_password' => env('ADMIN_PASSWORD', ''),

    'outreach_secret' => env('OUTREACH_SECRET', ''),

    'mail_bcc' => env('MAIL_BCC', 'info@carlmanuel.com'),

    'vapid_public_key' => env('VAPID_PUBLIC_KEY', ''),

    'vapid_private_key' => env('VAPID_PRIVATE_KEY', ''),

    'vapid_subject' => env('VAPID_SUBJECT', 'mailto:info@carlmanuel.com'),

    // Absolute HTTPS icon for Web Push (phones often ignore relative paths).
    'push_icon_url' => env(
        'PUSH_ICON_URL',
        'https://carlmanuel.com/static/images/pwa-icon-192.png'
    ),

    'push_badge_url' => env(
        'PUSH_BADGE_URL',
        'https://carlmanuel.com/static/images/pwa-icon-192.png'
    ),

    // Admin push: one preview_view notification per slug + session (Cache TTL safety net).
    'push_preview_view_throttle_minutes' => (int) env('PUSH_PREVIEW_VIEW_THROTTLE_MINUTES', 30),

];
