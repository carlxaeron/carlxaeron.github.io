<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $title ?? 'Carl Louis Manuel' }}</title>
</head>
<body style="margin:0;padding:0;background-color:#F3F6F5;-webkit-text-size-adjust:100%;">
@if (! empty($preheader))
    <div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">
        {{ $preheader }}
    </div>
@endif
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F3F6F5;border-collapse:collapse;">
    <tr>
        <td align="center" style="padding:24px 12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:100%;max-width:600px;border-collapse:collapse;background-color:#FFFFFF;">
                <tr>
                    <td style="background-color:#00473e;padding:28px 32px 20px 32px;">
                        <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#FFFFFF;">
                            Carl Louis Manuel
                        </p>
                        <p style="margin:6px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.4;color:#D4E9E2;">
                            Websites &amp; business systems
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="height:3px;line-height:3px;font-size:0;background-color:#CBA258;">&nbsp;</td>
                </tr>
                <tr>
                    <td style="padding:32px 32px 8px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1A1A1A;">
                        @yield('content')
                    </td>
                </tr>
                <tr>
                    <td style="padding:8px 32px 28px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55;color:#1A1A1A;">
                        @include('emails.partials.signature', ['showFacebookContact' => $showFacebookContact ?? true])
                    </td>
                </tr>
                <tr>
                    <td style="background-color:#1E3932;padding:16px 32px;">
                        <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.45;color:#D4E9E2;">
                            <a href="https://carlmanuel.com" style="color:#00A862;text-decoration:none;">carlmanuel.com</a>
                            &nbsp;·&nbsp;info@carlmanuel.com
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
</body>
</html>
