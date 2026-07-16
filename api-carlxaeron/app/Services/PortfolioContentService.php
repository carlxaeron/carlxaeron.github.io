<?php

namespace App\Services;

use App\Models\PortfolioContent;
use InvalidArgumentException;

class PortfolioContentService
{
    /** @var list<string> */
    public const SECTIONS = [
        'hero',
        'about',
        'header',
        'skills',
        'experiences',
        'companies',
        'projectDetails',
        'settings',
    ];

    public function isAllowedSection(string $section): bool
    {
        return in_array($section, self::SECTIONS, true);
    }

    /**
     * @return array{section: string, content: mixed, updatedAt: string|null, source: string}
     */
    public function read(string $section): array
    {
        $this->assertAllowed($section);

        $row = PortfolioContent::query()->find($section);

        return [
            'section' => $section,
            'content' => $row?->payload,
            'updatedAt' => $row?->updated_at?->toIso8601String(),
            'source' => $row === null ? 'static' : 'cms',
        ];
    }

    /**
     * @return array{section: string, content: mixed, updatedAt: string, source: string}
     */
    public function upsert(string $section, mixed $content): array
    {
        $this->assertAllowed($section);
        $this->validatePayload($section, $content);

        $row = PortfolioContent::query()->updateOrCreate(
            ['section' => $section],
            ['payload' => $content, 'updated_at' => now()]
        );

        return [
            'section' => $section,
            'content' => $row->payload,
            'updatedAt' => $row->updated_at?->toIso8601String(),
            'source' => 'cms',
        ];
    }

    private function assertAllowed(string $section): void
    {
        if (! $this->isAllowedSection($section)) {
            throw new InvalidArgumentException('Unknown content section: '.$section);
        }
    }

    private function validatePayload(string $section, mixed $content): void
    {
        if ($content === null) {
            throw new InvalidArgumentException('Content payload is required');
        }

        $listSections = ['skills', 'experiences', 'companies'];
        $objectSections = ['hero', 'about', 'header', 'projectDetails', 'settings'];

        if (in_array($section, $listSections, true)) {
            if (! is_array($content) || ! array_is_list($content)) {
                throw new InvalidArgumentException($section.' must be a JSON array');
            }

            return;
        }

        if (in_array($section, $objectSections, true)) {
            if (! is_array($content) || array_is_list($content)) {
                throw new InvalidArgumentException($section.' must be a JSON object');
            }
        }
    }
}
