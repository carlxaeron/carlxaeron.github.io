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

];
