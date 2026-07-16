<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('outreach_jobs')) {
            return;
        }

        Schema::create('outreach_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 64);
            $table->string('business_name');
            $table->string('contact_name');
            $table->string('contact_email');
            $table->string('preview_url', 512);
            $table->string('package_name')->nullable();
            $table->string('quoted_amount', 64)->nullable();
            $table->string('timeline')->nullable();
            $table->string('cadence', 8)->default('3d1w');
            $table->boolean('auto_followup')->default(true);
            $table->unsignedTinyInteger('max_followups')->default(4);
            $table->unsignedTinyInteger('follow_up_count')->default(0);
            $table->string('status', 32)->default('sent');
            $table->dateTime('initial_sent_at')->nullable();
            $table->dateTime('next_follow_up_at')->nullable();
            $table->dateTime('last_follow_up_at')->nullable();
            $table->string('last_error', 512)->nullable();
            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->unique(['slug', 'contact_email'], 'uq_outreach_slug_email');
            $table->index(['auto_followup', 'status', 'next_follow_up_at'], 'idx_outreach_due');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outreach_jobs');
    }
};
