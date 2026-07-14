<?php

namespace Tests\Unit;

use App\Services\AnalyticsExclusion;
use Tests\TestCase;

class AnalyticsExclusionTest extends TestCase
{
    private AnalyticsExclusion $analytics;

    protected function setUp(): void
    {
        parent::setUp();
        $this->analytics = new AnalyticsExclusion;
    }

    public function test_hash_ip_uses_portfolio_salt_and_truncates(): void
    {
        $expected = substr(hash('sha256', '1.2.3.4:carlxaeron-portfolio'), 0, 16);

        $this->assertSame($expected, $this->analytics->hashIp('1.2.3.4'));
        $this->assertNull($this->analytics->hashIp(null));
        $this->assertNull($this->analytics->hashIp(''));
    }

    public function test_parse_list_splits_and_normalizes(): void
    {
        $this->assertSame([], $this->analytics->parseList(null));
        $this->assertSame([], $this->analytics->parseList(''));
        $this->assertSame(['abc', 'def'], $this->analytics->parseList(' ABC , , DEF '));
    }

    public function test_parse_device_from_user_agent(): void
    {
        $this->assertSame('Mobile', $this->analytics->parseDevice('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)'));
        $this->assertSame('Mobile', $this->analytics->parseDevice('Android mobile Safari'));
        $this->assertSame('Desktop', $this->analytics->parseDevice('Mozilla/5.0 (Windows NT 10.0; Win64; x64)'));
        $this->assertSame('Desktop', $this->analytics->parseDevice(null));
    }

    public function test_is_excluded_record_by_ip_hash_and_visitor_id(): void
    {
        config([
            'portfolio.analytics_exclude_ip_hashes' => 'deadbeefdeadbeef',
            'portfolio.analytics_exclude_visitor_ids' => 'v-skip',
        ]);

        $this->assertTrue($this->analytics->isExcludedRecord('DEADBEEFDEADBEEF', null));
        $this->assertTrue($this->analytics->isExcludedRecord(null, 'V-SKIP'));
        $this->assertFalse($this->analytics->isExcludedRecord('aaaaaaaaaaaaaaaa', 'other'));
    }

    public function test_client_ip_prefers_first_forwarded_for(): void
    {
        $this->app->instance('request', request()->create('/', 'GET', [], [], [], [
            'HTTP_X_FORWARDED_FOR' => '9.9.9.9, 8.8.8.8',
            'REMOTE_ADDR' => '127.0.0.1',
        ]));

        $this->assertSame('9.9.9.9', $this->analytics->clientIp());
    }
}
