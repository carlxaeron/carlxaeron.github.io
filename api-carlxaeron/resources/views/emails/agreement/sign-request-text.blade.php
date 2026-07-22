Hi {!! $contactName !!},

I prepared a service agreement for {!! $businessName !!}. Please review it online and sign when you are ready.

Review & sign: {!! $signUrl !!}

This link expires on {!! $expiresLabel !!} (Asia/Manila).

@include('emails.partials.signature-text', ['showFacebookContact' => true])
