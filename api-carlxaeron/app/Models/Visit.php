<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'visitor_id',
        'session_id',
        'event_type',
        'section',
        'preview_slug',
        'path',
        'referrer',
        'user_agent',
        'language',
        'screen_json',
        'viewport_json',
        'device',
        'ip_hash',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'screen_json' => 'array',
            'viewport_json' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
