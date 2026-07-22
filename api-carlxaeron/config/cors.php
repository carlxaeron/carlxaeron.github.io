<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => [
        'health',
        'trackVisit',
        'previewFeedback',
        'analyticsSummary',
        'contact',
        'quotation',
        'assistant',
        'content/*',
        'agreements/*',
        'previewAccess/*',
        'admin/*',
        'up',
    ],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        'https://carlxaeron.github.io',
        'https://carlmanuel.com',
        'https://www.carlmanuel.com',
        'http://localhost:3000',
    ],

    // Lock-page Notify Carl from client Netlify demos.
    'allowed_origins_patterns' => [
        '#^https://[a-z0-9-]+\.netlify\.app$#i',
    ],

    'allowed_headers' => ['Content-Type', 'Accept', 'Origin', 'Authorization', 'X-Preview-Access-Secret'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,

];
