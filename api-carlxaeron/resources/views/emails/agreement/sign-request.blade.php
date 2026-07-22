@extends('emails.layouts.portfolio')

@section('content')
    <p style="margin:0 0 14px 0;">Hi {{ $contactName }},</p>

    <p style="margin:0 0 14px 0;">
        I prepared a <strong>service agreement</strong> for <strong>{{ $businessName }}</strong>.
        Please review it online and sign when you are ready.
    </p>

    @include('emails.partials.button', [
        'href' => $signUrl,
        'label' => 'Review & sign agreement',
    ])

    <p style="margin:0 0 14px 0;">
        Or open this link:<br>
        <a href="{{ $signUrl }}" style="color:#00A862;text-decoration:underline;">{{ $signUrl }}</a>
    </p>

    <p style="margin:0;">
        This link expires on <strong>{{ $expiresLabel }}</strong> (Asia/Manila).
    </p>
@endsection
