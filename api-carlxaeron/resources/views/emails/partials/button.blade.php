@php
    $href = $href ?? '#';
    $label = $label ?? 'Open link';
@endphp
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:16px 0;">
    <tr>
        <td align="left" style="border-radius:4px;background-color:#00A862;">
            <a href="{{ $href }}"
               style="display:inline-block;padding:12px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;line-height:1.3;color:#FFFFFF;text-decoration:none;border-radius:4px;">
                {{ $label }}
            </a>
        </td>
    </tr>
</table>
