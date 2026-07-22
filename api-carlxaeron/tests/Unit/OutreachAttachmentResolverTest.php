<?php

namespace Tests\Unit;

use App\Services\OutreachAttachmentResolver;
use Tests\TestCase;

class OutreachAttachmentResolverTest extends TestCase
{
    public function test_resolves_base64_jpeg(): void
    {
        $jpeg = base64_encode($this->tinyJpeg());
        $resolver = new OutreachAttachmentResolver();
        $files = $resolver->resolve([
            [
                'filename' => 'website-preview.jpg',
                'contentBase64' => $jpeg,
            ],
        ]);

        $this->assertCount(1, $files);
        $this->assertSame('website-preview.jpg', $files[0]['filename']);
        $this->assertSame('image/jpeg', $files[0]['mime']);
        $this->assertNotSame('', $files[0]['content']);
    }

    public function test_rejects_non_image(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $resolver = new OutreachAttachmentResolver();
        $resolver->resolve([
            [
                'filename' => 'notes.txt',
                'contentBase64' => base64_encode('hello world not an image'),
            ],
        ]);
    }

    public function test_rejects_too_many(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $jpeg = base64_encode($this->tinyJpeg());
        $items = [];
        for ($i = 0; $i < 5; $i++) {
            $items[] = ['filename' => "shot-{$i}.jpg", 'contentBase64' => $jpeg];
        }
        (new OutreachAttachmentResolver())->resolve($items);
    }

    private function tinyJpeg(): string
    {
        return base64_decode(
            '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k='
        ) ?: '';
    }
}
