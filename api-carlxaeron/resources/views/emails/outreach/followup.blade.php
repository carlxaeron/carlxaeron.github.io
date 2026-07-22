@extends('emails.layouts.portfolio')

@section('content')
    <p style="margin:0 0 14px 0;">Hi {{ $contactName }},</p>

    <p style="margin:0 0 14px 0;">
        Checking in about the sample <strong>{{ $systemPhrase }}</strong> and website for <strong>{{ $businessName }}</strong>.
    </p>

    <p style="margin:0 0 14px 0;">
        <strong>Preview (admin + site):</strong>
        <a href="{{ $previewUrl }}" style="color:#00A862;text-decoration:underline;">{{ $previewUrl }}</a>
    </p>

    @include('emails.partials.button', [
        'href' => $previewUrl,
        'label' => 'Open preview (admin + site)',
    ])

    @if ($isWeekFollowUp)
        <p style="margin:0 0 14px 0;">
            Did you <strong>browse the admin</strong> preview and like the sample, want <strong>revisions</strong>, or is it <strong>not a fit right now</strong>?
        </p>
        <p style="margin:0 0 14px 0;">
            Website payment stays <strong>{{ $paymentTerms }}</strong>@if ($discounted !== null)
                on the discounted <strong>website</strong> total of <strong>{{ $discounted }}</strong>
            @endif.
            Only the upfront half is due to start the website.
        </p>
    @else
        <p style="margin:0 0 14px 0;">
            Did the <strong>admin</strong> preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site.
            Anything to change? Ready to proceed with the <strong>website</strong> package (<strong>{{ $packageName }}</strong>@if ($discounted !== null)
                at <strong>{{ $discounted }}</strong>
            @endif)?
            Only the upfront portion is due to begin — not the full website amount. Want a live system too? I can quote that separately.
        </p>
    @endif

    <p style="margin:0 0 14px 0;font-style:italic;color:#1E3932;">
        Quoted figures are for the <strong>website only</strong>. The admin preview is a sample — a production system is priced separately if you want one.
    </p>

    @if ($totalPct > 0)
        <p style="margin:0 0 14px 0;">
            This check-in includes a <strong>{{ $totalPct }}% discount</strong>
            @if ($showAnotherStep)
                (another <strong>{{ $stepPct }}%</strong> off)
            @endif
            from the original package
            @if ($quotedAmount !== '')
                of {{ $quotedAmount }}
            @endif
            @if ($discounted !== null)
                — now <strong>{{ $discounted }}</strong> total
            @endif
            . Maximum goodwill discount is 50% off.
        </p>
    @endif

    <p style="margin:0 0 14px 0;">
        I can also offer a <strong>commission</strong> if you refer clients or want a partner arrangement — just message me and we can discuss a fair split.
    </p>

    <p style="margin:0;">
        A short reply works whenever you have a moment.
    </p>
@endsection
