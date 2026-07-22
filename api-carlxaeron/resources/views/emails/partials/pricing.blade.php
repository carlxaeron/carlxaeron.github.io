@php
    $packageName = $packageName ?? 'Starter Business Website';
    $quotedAmount = $quotedAmount ?? '';
    $paymentTerms = $paymentTerms ?? '';
    $timeline = $timeline ?? '';
@endphp
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:16px 0;background-color:#D4E9E2;">
    <tr>
        <td style="padding:16px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#1A1A1A;">
            <p style="margin:0 0 8px 0;">
                <strong>Package:</strong> {{ $packageName }} <em>(website only)</em>
            </p>
            @if ($quotedAmount !== '')
                <p style="margin:0 0 8px 0;">
                    <strong>Investment (website only):</strong> {{ $quotedAmount }}
                </p>
            @endif
            <p style="margin:0 0 8px 0;">
                <strong>Payment:</strong> {{ $paymentTerms }}
            </p>
            @if ($timeline !== '')
                <p style="margin:0 0 8px 0;">
                    <strong>Timeline:</strong> {{ $timeline }}
                </p>
            @endif
            <p style="margin:0 0 8px 0;">
                <strong>Admin system:</strong> the preview includes a <em>sample</em> so you can explore how day-to-day operations could look.
                A production business system is <strong>priced separately</strong> if you want that built for real.
            </p>
            <p style="margin:0;">
                <em>To start the website, only the upfront portion is due — not the full website amount.</em>
            </p>
        </td>
    </tr>
</table>
