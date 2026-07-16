<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('visits')) {
            Schema::create('visits', function (Blueprint $table) {
                $table->id();
                $table->string('visitor_id', 64);
                $table->string('session_id', 64);
                $table->string('event_type', 32)->default('pageview');
                $table->string('section', 32)->nullable();
                $table->string('preview_slug', 64)->nullable();
                $table->string('path', 512)->nullable();
                $table->string('referrer', 512)->nullable();
                $table->string('user_agent', 512)->nullable();
                $table->string('language', 32)->nullable();
                $table->json('screen_json')->nullable();
                $table->json('viewport_json')->nullable();
                $table->string('device', 32)->nullable();
                $table->string('ip_hash', 16)->nullable();
                $table->dateTime('created_at')->useCurrent();

                $table->index('created_at', 'idx_visits_created');
                $table->index('event_type', 'idx_visits_event');
                $table->index('preview_slug', 'idx_visits_slug');
                $table->index('visitor_id', 'idx_visits_visitor');
            });
        }

        if (! Schema::hasTable('preview_feedback')) {
            Schema::create('preview_feedback', function (Blueprint $table) {
                $table->id();
                $table->string('visitor_id', 64);
                $table->string('session_id', 64);
                $table->string('preview_slug', 64);
                $table->string('preview_label', 128)->nullable();
                $table->string('sentiment', 16);
                $table->string('comment', 1000)->nullable();
                $table->string('ip_hash', 16)->nullable();
                $table->dateTime('created_at')->useCurrent();

                $table->unique(['visitor_id', 'preview_slug'], 'uq_feedback_visitor_slug');
                $table->index('sentiment', 'idx_feedback_sentiment');
                $table->index('preview_slug', 'idx_feedback_slug');
            });
        }

        if (! Schema::hasTable('contact')) {
            Schema::create('contact', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('email');
                $table->text('message');
                $table->dateTime('created_at')->useCurrent();
            });
        }

        if (! Schema::hasTable('quotations')) {
            Schema::create('quotations', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('company')->nullable();
                $table->string('email');
                $table->string('phone', 64)->nullable();
                $table->string('project_type', 128)->nullable();
                $table->string('budget_range', 128)->nullable();
                $table->string('currency', 3)->nullable();
                $table->string('timeline', 128)->nullable();
                $table->json('services_json')->nullable();
                $table->text('details');
                $table->dateTime('created_at')->useCurrent();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
        Schema::dropIfExists('contact');
        Schema::dropIfExists('preview_feedback');
        Schema::dropIfExists('visits');
    }
};
