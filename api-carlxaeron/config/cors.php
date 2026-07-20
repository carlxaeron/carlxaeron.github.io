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

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Accept', 'Origin', 'Authorization'],

    'exposed_headers' => [],

    'max_age' => 86400,

    'supports_credentials' => false,

];
