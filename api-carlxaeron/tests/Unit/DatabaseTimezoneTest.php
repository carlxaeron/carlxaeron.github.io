<?php

namespace Tests\Unit;

use Tests\TestCase;

class DatabaseTimezoneTest extends TestCase
{
    public function test_mysql_connection_uses_utc_session_timezone(): void
    {
        $this->assertSame('+00:00', config('database.connections.mysql.timezone'));
        $this->assertSame('+00:00', config('database.connections.mariadb.timezone'));
        $this->assertSame('UTC', config('app.timezone'));
    }
}
