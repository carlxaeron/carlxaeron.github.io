<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PreviewFeedback extends Model
{
    public $timestamps = false;

    protected $table = 'preview_feedback';

    protected $fillable = [
        'visitor_id',
        'session_id',
        'preview_slug',
        'preview_label',
        'sentiment',
        'comment',
        'prospect_email',
        'auto_reply_sent_at',
        'ip_hash',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'auto_reply_sent_at' => 'datetime',
        ];
    }
}
