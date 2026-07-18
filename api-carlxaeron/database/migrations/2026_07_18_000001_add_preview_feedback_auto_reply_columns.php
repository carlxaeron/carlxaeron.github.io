<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('preview_feedback')) {
            return;
        }

        Schema::table('preview_feedback', function (Blueprint $table) {
            if (! Schema::hasColumn('preview_feedback', 'prospect_email')) {
                $table->string('prospect_email', 255)->nullable()->after('comment');
            }
            if (! Schema::hasColumn('preview_feedback', 'auto_reply_sent_at')) {
                $table->dateTime('auto_reply_sent_at')->nullable()->after('prospect_email');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('preview_feedback')) {
            return;
        }

        Schema::table('preview_feedback', function (Blueprint $table) {
            if (Schema::hasColumn('preview_feedback', 'auto_reply_sent_at')) {
                $table->dropColumn('auto_reply_sent_at');
            }
            if (Schema::hasColumn('preview_feedback', 'prospect_email')) {
                $table->dropColumn('prospect_email');
            }
        });
    }
};
