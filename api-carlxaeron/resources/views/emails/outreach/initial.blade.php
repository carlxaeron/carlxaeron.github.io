@extends('emails.layouts.portfolio')

@section('content')
    <h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;font-weight:normal;color:#00473e;">
        {{ $headline }}
    </h1>

    <p style="margin:0 0 14px 0;">Hi {{ $contactName }},</p>

    <p style="margin:0 0 14px 0;">
        @if ($systemLabel !== '' && $systemPain !== '')
            I prepared a sample <strong>{{ $systemLabel }}</strong> for <strong>{{ $businessName }}</strong>.
            <strong>{{ $systemPain }}</strong>
        @elseif ($systemLabel !== '')
            I prepared a sample <strong>{{ $systemLabel }}</strong> for <strong>{{ $businessName }}</strong>
            — so day-to-day work lives in one place instead of scattered chats and notes.
        @else
            I prepared a sample <strong>business admin system and website</strong> for <strong>{{ $businessName }}</strong>
            — operations first, with a marketing site as the public face.
        @endif
    </p>

    <p style="margin:0 0 14px 0;">
        <strong>Start with the admin (desktop &amp; mobile):</strong>
        the preview opens on your <strong>{{ $adminBrowseLabel }}</strong> — already logged in at <code>/admin/</code>.
        Scroll inside the frames and click Dashboard, Bookings/Calendar, and other sample pages.
    </p>

    <p style="margin:0 0 14px 0;">
        <strong>Then the marketing site:</strong>
        desktop and mobile pages at <code>/</code> show how {{ $businessName }} could look online.
    </p>

    @if ($siteAccessUrl !== '' || $adminAccessUrl !== '')
        <p style="margin:0 0 8px 0;">
            @if ($siteAccessUrl !== '')
                <strong>Open website (one-time):</strong>
                <a href="{{ $siteAccessUrl }}" style="color:#00A862;text-decoration:underline;">{{ $siteAccessUrl }}</a>
                @if ($adminAccessUrl !== '')
                    <br>
                @endif
            @endif
            @if ($adminAccessUrl !== '')
                <strong>Open admin sample (one-time):</strong>
                <a href="{{ $adminAccessUrl }}" style="color:#00A862;text-decoration:underline;">{{ $adminAccessUrl }}</a>
            @endif
        </p>
        <p style="margin:0 0 14px 0;font-style:italic;color:#1E3932;">
            Each link opens once — refresh closes access. Use Notify Carl on the lock screen if you need another look.
        </p>
        @if ($siteAccessUrl !== '')
            @include('emails.partials.button', [
                'href' => $siteAccessUrl,
                'label' => 'Open website sample (one-time)',
            ])
        @endif
        @if ($adminAccessUrl !== '')
            @include('emails.partials.button', [
                'href' => $adminAccessUrl,
                'label' => 'Open admin sample (one-time)',
            ])
        @endif
    @endif

    <p style="margin:0 0 14px 0;">
        <strong>Iframe preview (portfolio):</strong>
        <a href="{{ $previewUrl }}" style="color:#00A862;text-decoration:underline;">{{ $previewUrl }}</a>
    </p>

    @include('emails.partials.button', [
        'href' => $previewUrl,
        'label' => 'Open portfolio preview',
    ])

    @if ($hasAttachments)
        <p style="margin:0 0 14px 0;">
            <strong>Attached:</strong> screenshots of the sample <em>website</em> and <em>admin/system</em>
            (so you can glance at them without opening the preview first).
        </p>
    @endif

    @include('emails.partials.pricing', [
        'packageName' => $packageName,
        'quotedAmount' => $quotedAmount,
        'paymentTerms' => $paymentTerms,
        'timeline' => $timeline,
    ])

    <p style="margin:16px 0 0 0;">
        Reply if the admin and site previews look right, you want changes, or you are ready to proceed
        (website now, and/or a custom quote for a live system).
    </p>
@endsection
