Hi {{ $contactName }},

@if ($systemLabel !== '' && $systemPain !== '')
I prepared a sample {!! $systemLabel !!} for {!! $businessName !!}. {!! $systemPain !!}
@elseif ($systemLabel !== '')
I prepared a sample {!! $systemLabel !!} for {!! $businessName !!} — so day-to-day work lives in one place instead of scattered chats and notes.
@else
I prepared a sample business admin system and website for {!! $businessName !!} — operations first, with a marketing site as the public face.
@endif

Start with the admin (desktop & mobile): {!! $adminBrowseLabel !!} at /admin/ — scroll inside the frames and browse the sample pages.

Then the marketing site at / on desktop and mobile.
@if ($siteAccessUrl !== '')
Open website (one-time): {!! $siteAccessUrl !!}
@endif
@if ($adminAccessUrl !== '')
Open admin sample (one-time): {!! $adminAccessUrl !!}
@endif
@if ($siteAccessUrl !== '' || $adminAccessUrl !== '')
Each link opens once — refresh closes access. Use Notify Carl on the lock screen if you need another look.
@endif
Iframe preview (portfolio): {!! $previewUrl !!}

@if ($hasAttachments)
Attached: screenshots of the sample website and admin/system (so you can glance at them without opening the preview first).

@endif
@include('emails.partials.pricing-text', [
    'packageName' => $packageName,
    'quotedAmount' => $quotedAmount,
    'paymentTerms' => $paymentTerms,
    'timeline' => $timeline,
])

Reply if the admin and site previews look right, you want changes, or you are ready to proceed (website now, and/or a custom quote for a live system).

@include('emails.partials.signature-text', ['showFacebookContact' => true])
