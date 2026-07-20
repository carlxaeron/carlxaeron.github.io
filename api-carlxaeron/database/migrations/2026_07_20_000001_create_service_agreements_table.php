<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('service_agreements')) {
            return;
        }

        Schema::create('service_agreements', function (Blueprint $table) {
            $table->id();
            $table->string('token', 64)->unique();
            $table->string('slug', 64);
            $table->string('business_name');
            $table->string('client_email');
            $table->string('client_name');
            $table->json('form_json');
            $table->longText('filled_html');
            $table->string('status', 32)->default('sent');
            $table->string('client_signatory_name')->nullable();
            $table->string('client_signatory_title')->nullable();
            $table->dateTime('client_signed_at')->nullable();
            $table->longText('client_signature_data')->nullable();
            $table->string('client_ip', 64)->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->dateTime('viewed_at')->nullable();
            $table->dateTime('expires_at')->nullable();
            $table->timestamps();

            $table->index(['slug', 'status'], 'idx_agreements_slug_status');
            $table->index('expires_at', 'idx_agreements_expires');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_agreements');
    }
};
