<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('quotations') || Schema::hasColumn('quotations', 'currency')) {
            return;
        }

        Schema::table('quotations', function (Blueprint $table) {
            $table->string('currency', 3)->nullable()->after('budget_range');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('quotations') || ! Schema::hasColumn('quotations', 'currency')) {
            return;
        }

        Schema::table('quotations', function (Blueprint $table) {
            $table->dropColumn('currency');
        });
    }
};
