<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutreachJob extends Model
{
    protected $table = 'outreach_jobs';

    protected $fillable = [
        'slug',
        'business_name',
        'contact_name',
        'contact_email',
        'preview_url',
        'package_name',
        'quoted_amount',
        'timeline',
        'cadence',
        'auto_followup',
        'max_followups',
        'follow_up_count',
        'status',
        'initial_sent_at',
        'next_follow_up_at',
        'last_follow_up_at',
        'last_error',
    ];

    protected function casts(): array
    {
        return [
            'auto_followup' => 'boolean',
            'max_followups' => 'integer',
            'follow_up_count' => 'integer',
            'initial_sent_at' => 'datetime',
            'next_follow_up_at' => 'datetime',
            'last_follow_up_at' => 'datetime',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }
}
