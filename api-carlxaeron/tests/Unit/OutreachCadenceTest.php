<?php

namespace Tests\Unit;

use App\Services\OutreachCadence;
use Tests\TestCase;

class OutreachCadenceTest extends TestCase
{
    public function test_normalize_cadence(): void
    {
        $this->assertSame('3d1w', OutreachCadence::normalize(''));
        $this->assertSame('3d1w', OutreachCadence::normalize('3d1w'));
        $this->assertSame('3d1w', OutreachCadence::normalize('seq'));
        $this->assertSame('3d', OutreachCadence::normalize('3d'));
        $this->assertSame('1w', OutreachCadence::normalize('1w'));
        $this->assertSame('3d1w', OutreachCadence::normalize('3D1W'));
    }

    public function test_days_until_next_3d1w_sequence(): void
    {
        $this->assertSame(3, OutreachCadence::daysUntilNext('3d1w', 0));
        $this->assertSame(7, OutreachCadence::daysUntilNext('3d1w', 1));
        $this->assertSame(7, OutreachCadence::daysUntilNext('3d1w', 2));
        $this->assertSame(7, OutreachCadence::daysUntilNext('3d1w', 3));
    }

    public function test_followup_discount_ladder(): void
    {
        $this->assertSame([10, 10, 10, 20], OutreachCadence::followupDiscountSteps());
        $this->assertSame(10, OutreachCadence::followupDiscountTotal(0));
        $this->assertSame(20, OutreachCadence::followupDiscountTotal(1));
        $this->assertSame(30, OutreachCadence::followupDiscountTotal(2));
        $this->assertSame(50, OutreachCadence::followupDiscountTotal(3));
    }
}
