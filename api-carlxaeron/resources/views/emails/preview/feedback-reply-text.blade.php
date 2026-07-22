Hi {!! $contactName !!},

@if ($sentiment === 'dislike')
Thank you for sharing feedback on the sample website and admin system for {!! $businessName !!}.

@if ($comment !== '')
I read your note: "{!! strip_tags($comment) !!}"

@endif
What would make the sample feel right for you? I am happy to revise before we move forward.

If you are still interested, reply with what to change. If timing is not right, just let me know.

Preview: {!! $previewUrl !!}
@elseif ($sentiment === 'agree')
Thank you for confirming you want to move forward with the sample website for {!! $businessName !!}. I will follow up shortly with next steps.

The quoted package is website only; the admin preview is a sample — a production system is priced separately if you want one.

Preview: {!! $previewUrl !!}

Reply anytime if you have questions before I reach out.
@else
Thank you for liking the sample website and admin system for {!! $businessName !!}.

If you are ready to push through on the website, we can begin with the deposit ({!! $paymentTerms !!}).
@if ($timeline !== '')
We can target {!! $timeline !!} once the project starts.
@else
We can agree on a timeline once you are ready to begin.
@endif
The quoted package is website only; the admin preview is a sample — a production system is priced separately if you want one.

Preview (site + admin): {!! $previewUrl !!}

Reply if you want to proceed, need a tweak first, or have questions.
@endif

@include('emails.partials.signature-text', ['showFacebookContact' => true])
