<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('preview_access_tokens')) {
            return;
        }

        Schema::create('preview_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->string('slug', 64);
            $table->string('netlify_host', 255);
            $table->string('scope', 16); // site | admin
            $table->string('status', 32)->default('unused'); // unused | used | revoked | expired
            $table->dateTime('expires_at')->nullable();
            $table->dateTime('used_at')->nullable();
            $table->string('used_ip', 64)->nullable();
            $table->string('used_ua', 512)->nullable();
            $table->unsignedBigInteger('outreach_job_id')->nullable();
            $table->string('contact_email')->nullable();
            $table->unsignedInteger('unlock_request_count')->default(0);
            $table->dateTime('last_unlock_requested_at')->nullable();
            $table->timestamps();

            $table->index(['slug', 'scope', 'status'], 'idx_preview_access_slug_scope_status');
            $table->index('netlify_host', 'idx_preview_access_host');
            $table->index('expires_at', 'idx_preview_access_expires');
            $table->index('outreach_job_id', 'idx_preview_access_outreach_job');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('preview_access_tokens');
    }
};
