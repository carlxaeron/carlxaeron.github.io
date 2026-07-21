<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('visits')) {
            return;
        }

        Schema::table('visits', function (Blueprint $table) {
            if (! Schema::hasColumn('visits', 'ip_address')) {
                $table->string('ip_address', 45)->nullable()->after('ip_hash');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('visits')) {
            return;
        }

        Schema::table('visits', function (Blueprint $table) {
            if (Schema::hasColumn('visits', 'ip_address')) {
                $table->dropColumn('ip_address');
            }
        });
    }
};
