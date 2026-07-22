Hi {!! $contactName !!},

Checking in about the {!! $systemPhrase !!} and website for {!! $businessName !!}.
Preview: {!! $previewUrl !!}

@if ($isWeekFollowUp)
Did you browse the admin preview and like the sample, want revisions, or is it not a fit right now?

Website payment stays {!! $paymentTerms !!}@if ($discounted !== null) on the discounted website total of {!! $discounted !!}@endif. Only the upfront half is due to start the website.
@else
Did the admin preview look useful on desktop and mobile? Browse the pages inside the frames, then the marketing site. Anything to change? Ready to proceed with the website package ({!! $packageName !!}@if ($discounted !== null) at {!! $discounted !!}@endif)? Only the upfront portion is due to begin — not the full website amount. Want a live system too? I can quote that separately.
@endif

Quoted figures are for the website only. The admin preview is a sample — a production system is priced separately if you want one.

@if ($totalPct > 0)
This check-in includes a {{ $totalPct }}% discount
@if ($showAnotherStep)
 (another {{ $stepPct }}% off)
@endif
 from the original package
@if ($quotedAmount !== '')
 of {!! $quotedAmount !!}
@endif
@if ($discounted !== null)
 — now {!! $discounted !!} total
@endif
. Maximum goodwill discount is 50% off.

@endif
I can also offer a commission if you refer clients or want a partner arrangement — just message me and we can discuss a fair split.

A short reply works whenever you have a moment.

@include('emails.partials.signature-text', ['showFacebookContact' => true])
