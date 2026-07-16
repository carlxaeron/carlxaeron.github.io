<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioContent extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $primaryKey = 'section';

    protected $table = 'portfolio_content_sections';

    protected $fillable = [
        'section',
        'payload',
    ];

    protected $casts = [
        'payload' => 'array',
        'updated_at' => 'datetime',
    ];

    public $timestamps = false;
}
