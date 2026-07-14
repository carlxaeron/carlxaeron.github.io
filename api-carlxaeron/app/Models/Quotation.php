<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quotation extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'name',
        'company',
        'email',
        'phone',
        'project_type',
        'budget_range',
        'timeline',
        'services_json',
        'details',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'services_json' => 'array',
            'created_at' => 'datetime',
        ];
    }
}
