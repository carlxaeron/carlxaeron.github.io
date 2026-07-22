<?php

namespace App\Console\Commands;

use App\Services\OutreachFollowupProcessor;
use Illuminate\Console\Command;

class OutreachFollowupsCommand extends Command
{
    protected $signature = 'outreach:followups {--limit=50 : Max jobs to process}';

    protected $description = 'Send due quotation follow-up emails via Blade + SMTP';

    public function handle(OutreachFollowupProcessor $processor): int
    {
        $limit = max(1, (int) $this->option('limit'));
        $started = now()->toIso8601String();
        $this->info("[{$started}] outreach follow-up cron start");

        try {
            $summary = $processor->process($limit);
            $line = sprintf(
                '[%s] processed=%d sent=%d errors=%d',
                now()->toIso8601String(),
                $summary['processed'],
                $summary['sent'],
                count($summary['errors'])
            );
            $this->info($line);
            foreach ($summary['errors'] as $error) {
                $this->error('  ERR: '.$error);
            }

            if (count($summary['errors']) > 0 && $summary['sent'] === 0) {
                return self::FAILURE;
            }

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('['.now()->toIso8601String().'] FATAL: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
