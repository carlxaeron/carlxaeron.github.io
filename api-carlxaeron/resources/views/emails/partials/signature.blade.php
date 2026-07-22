@php
    use App\Support\OutreachSignature;
    $size = (string) OutreachSignature::PHOTO_SIZE;
@endphp
@if (! empty($showFacebookContact))
    <p style="margin:0 0 16px 0;">
        You can also message me on
        <a href="{{ OutreachSignature::FB_URL }}" style="color:#00A862;text-decoration:underline;">Facebook</a>
        if that is easier.
    </p>
@endif
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
    <tr>
        <td style="vertical-align:middle;padding-right:12px;">
            <img src="{{ OutreachSignature::PHOTO_URL }}"
                 width="{{ $size }}"
                 height="{{ $size }}"
                 alt="{{ OutreachSignature::PHOTO_ALT }}"
                 style="border-radius:50%;display:block;width:{{ $size }}px;height:{{ $size }}px;object-fit:cover;border:0;" />
        </td>
        <td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.45;color:#1A1A1A;">
            Best regards,<br>
            <strong>Carl Louis Manuel</strong><br>
            <a href="https://carlmanuel.com" style="color:#00A862;text-decoration:underline;">carlmanuel.com</a>
            &nbsp;·&nbsp;
            <a href="{{ OutreachSignature::FB_URL }}" style="color:#00A862;text-decoration:underline;">Facebook</a>
            &nbsp;·&nbsp;
            <a href="tel:{{ OutreachSignature::PHONE_TEL }}" style="color:#00A862;text-decoration:underline;">{{ OutreachSignature::PHONE_DISPLAY }}</a>
            &nbsp;·&nbsp;
            info@carlmanuel.com
        </td>
    </tr>
</table>
