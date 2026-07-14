<?php

namespace App\Services;

use App\Mail\ContactReceived;
use App\Mail\QuotationReceived;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

final class PortfolioMailer
{
    /** @return list<string> */
    public function recipients(): array
    {
        $raw = (string) config('portfolio.mail_to', '');

        return array_values(array_filter(array_map('trim', explode(',', $raw))));
    }

    public function sendContact(string $name, string $email, string $message): void
    {
        $to = $this->recipients();
        if ($to === []) {
            throw new \RuntimeException('No mail recipients configured');
        }

        Mail::to($to)->send(new ContactReceived($name, $email, $message));
    }

    /** @param array{name:string,company:string,email:string,phone:string,projectType:string,budgetRange:string,timeline:string,services:list<string>,details:string} $quote */
    public function sendQuotation(array $quote): void
    {
        $to = $this->recipients();
        if ($to === []) {
            throw new \RuntimeException('No mail recipients configured');
        }

        Mail::to($to)->send(new QuotationReceived($quote));
    }

    public function trySend(callable $send, string $context): void
    {
        try {
            $send();
        } catch (Throwable $e) {
            Log::warning("{$context} SMTP failed: ".$e->getMessage());
        }
    }
}
