@extends('emails.layouts.portfolio')

@section('content')
    @if ($sentiment === 'dislike')
        <h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;font-weight:normal;color:#00473e;">
            Thanks for your honest feedback
        </h1>
        <p style="margin:0 0 14px 0;">Hi {{ $contactName }},</p>
        <p style="margin:0 0 14px 0;">
            Thank you for taking a moment to share feedback on the sample website and admin system for <strong>{{ $businessName }}</strong>.
            Honest input helps me get the preview closer to what you want.
        </p>
        @if ($comment !== '')
            <p style="margin:0 0 14px 0;">I read your note: <em>“{{ $comment }}”</em></p>
        @endif
        <p style="margin:0 0 14px 0;">
            What would make the sample feel right for you — layout, photos, wording, or something else?
            I am happy to revise before we move forward.
        </p>
        <p style="margin:0 0 14px 0;">
            If you are still interested, reply with what to change. If timing is not right, that is okay too — just let me know.
        </p>
        <p style="margin:0 0 8px 0;">
            <strong>Preview:</strong>
            <a href="{{ $previewUrl }}" style="color:#00A862;text-decoration:underline;">{{ $previewUrl }}</a>
        </p>
    @elseif ($sentiment === 'agree')
        <h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;font-weight:normal;color:#00473e;">
            Thanks — you are ready to proceed
        </h1>
        <p style="margin:0 0 14px 0;">Hi {{ $contactName }},</p>
        <p style="margin:0 0 14px 0;">
            Thank you for confirming you want to move forward with the sample website for <strong>{{ $businessName }}</strong>.
            I will follow up shortly with next steps.
        </p>
        <p style="margin:0 0 14px 0;">
            The quoted package is <strong>website only</strong>; the admin preview is a sample — a production system is priced separately if you want one.
        </p>
        <p style="margin:0 0 8px 0;">
            <strong>Preview again:</strong>
            <a href="{{ $previewUrl }}" style="color:#00A862;text-decoration:underline;">{{ $previewUrl }}</a>
        </p>
        <p style="margin:14px 0 0 0;">Reply anytime if you have questions before I reach out.</p>
    @else
        <h1 style="margin:0 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;font-weight:normal;color:#00473e;">
            Thanks for the thumbs up
        </h1>
        <p style="margin:0 0 14px 0;">Hi {{ $contactName }},</p>
        <p style="margin:0 0 14px 0;">
            Thank you for liking the sample website and admin system I prepared for <strong>{{ $businessName }}</strong>.
            It is good to know the direction resonates with you.
        </p>
        <p style="margin:0 0 14px 0;">
            If you are ready to <strong>push through on the website</strong>, we can begin with the deposit
            (<strong>{{ $paymentTerms }}</strong>).
            @if ($timeline !== '')
                We can target <strong>{{ $timeline }}</strong> once the project starts.
            @else
                We can agree on a timeline once you are ready to begin.
            @endif
            The quoted package is <strong>website only</strong>; the admin preview is a sample — a production system is priced separately if you want one.
        </p>
        <p style="margin:0 0 8px 0;">
            <strong>Preview again (site + admin on desktop &amp; mobile):</strong>
            <a href="{{ $previewUrl }}" style="color:#00A862;text-decoration:underline;">{{ $previewUrl }}</a>
        </p>
        <p style="margin:14px 0 0 0;">
            Reply to this email if you want to proceed, need a quick tweak first, or have questions about scope or payment.
        </p>
    @endif

    @include('emails.partials.button', [
        'href' => $previewUrl,
        'label' => 'Open preview',
    ])
@endsection
