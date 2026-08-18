using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace DFANDE.Infrastructure.Services;

public class SmtpEmailService(
    IOptions<SmtpSettings> smtpOptions,
    ILogger<SmtpEmailService> logger) : IEmailService
{
    private readonly SmtpSettings _settings = smtpOptions.Value;

    public async Task SendContactNotificationEmailAsync(ContactSubmission submission, CancellationToken cancellationToken = default)
    {
        var recipient = _settings.NotificationRecipient;
        var subject = $"[DF&E Inquiry] {submission.Subject} - From {submission.Name}";

        Console.WriteLine($"[EMAIL SERVICE] Initiating Contact Notification Email for '{submission.Name}' ({submission.Email}) -> Recipient: '{recipient}' via {_settings.Host}:{_settings.Port}");

        logger.LogInformation(
            "Initiating Contact Email Notification. SubmissionId: {SubmissionId}, Recipient: {Recipient}, SenderName: {SenderName}, SenderEmail: {SenderEmail}, ServiceOfInterest: {Service}, Subject: {Subject}",
            submission.Id,
            recipient,
            submission.Name,
            submission.Email,
            submission.ServiceOfInterest ?? "General Inquiry",
            submission.Subject);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        message.To.Add(new MailboxAddress("DF&E Operations", recipient));
        message.ReplyTo.Add(new MailboxAddress(submission.Name, submission.Email));
        message.Subject = subject;

        var htmlBody = GenerateBrandedHtmlTemplate(submission);
        message.Body = new TextPart(TextFormat.Html) { Text = htmlBody };

        try
        {
            using var client = new SmtpClient();
            client.ServerCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;

            var secureSocketOptions = _settings.Security.Equals("SslOnConnect", StringComparison.OrdinalIgnoreCase)
                ? SecureSocketOptions.SslOnConnect
                : SecureSocketOptions.StartTls;

            Console.WriteLine($"[EMAIL SERVICE] Connecting to {_settings.Host}:{_settings.Port} with {secureSocketOptions}...");
            await client.ConnectAsync(_settings.Host, _settings.Port, secureSocketOptions, cancellationToken);

            if (!string.IsNullOrEmpty(_settings.Username) && !string.IsNullOrEmpty(_settings.Password))
            {
                Console.WriteLine($"[EMAIL SERVICE] Authenticating as {_settings.Username}...");
                await client.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
            }

            Console.WriteLine("[EMAIL SERVICE] Dispatching MimeMessage...");
            var sendResult = await client.SendAsync(message, cancellationToken);
            await client.DisconnectAsync(true, cancellationToken);

            Console.WriteLine($"[EMAIL SERVICE] SUCCESS: Email sent to {recipient}! Result: {sendResult}");

            logger.LogInformation(
                "Contact Email Notification successfully dispatched to {Recipient} via {Host}:{Port} for SubmissionId: {SubmissionId}. Result: {Result}",
                recipient,
                _settings.Host,
                _settings.Port,
                submission.Id,
                sendResult);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[EMAIL SERVICE] ERROR: Failed to send email to {recipient}. {ex.GetType().Name}: {ex.Message}");
            logger.LogError(
                ex,
                "Failed to dispatch contact notification email to {Recipient} for SubmissionId: {SubmissionId}. Error: {Message}",
                recipient,
                submission.Id,
                ex.Message);
        }
    }

    private static string GenerateBrandedHtmlTemplate(ContactSubmission s)
    {
        var formattedDate = DateTime.UtcNow.ToString("dd MMM yyyy, HH:mm 'UTC'");
        var service = string.IsNullOrWhiteSpace(s.ServiceOfInterest) ? "General Technical Inquiry" : s.ServiceOfInterest;
        var phone = string.IsNullOrWhiteSpace(s.Phone) ? "Not Provided" : s.Phone;
        var replyMailto = $"mailto:{s.Email}?subject={Uri.EscapeDataString("Re: " + s.Subject + " - DF&E Support")}";

        return $@"
<!DOCTYPE html PUBLIC ""-//W3C//DTD XHTML 1.0 Transitional//EN"" ""http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"">
<html xmlns=""http://www.w3.org/1999/xhtml"" lang=""en"">
<head>
  <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"" />
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"" />
  <title>New Technical Inquiry - Divine Flame &amp; Energy</title>
</head>
<body style=""margin: 0; padding: 0; background-color: #0b0d12; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;"">

  <!-- OUTER BACKGROUND TABLE -->
  <table width=""100%"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #0b0d12; padding: 32px 16px;"">
    <tr>
      <td align=""center"">

        <!-- MAIN CONTAINER (600px Max Width) -->
        <table width=""100%"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.5); border: 1px solid #1f2633;"">

          <!-- 1. CORPORATE HEADER -->
          <tr>
            <td style=""background: linear-gradient(135deg, #11141c 0%, #1a202c 100%); padding: 36px 32px; text-align: center; border-bottom: 3px solid #DD9933;"">
              <table width=""100%"" border=""0"" cellpadding=""0"" cellspacing=""0"">
                <tr>
                  <td align=""center"">
                    <!-- Brand Pill Badge -->
                    <div style=""display: inline-block; background-color: rgba(221, 153, 51, 0.15); border: 1px solid rgba(221, 153, 51, 0.4); border-radius: 20px; padding: 4px 14px; margin-bottom: 12px;"">
                      <span style=""font-family: monospace, sans-serif; font-size: 11px; font-weight: 700; color: #DD9933; letter-spacing: 2px; text-transform: uppercase;"">
                        Official Client Notification
                      </span>
                    </div>
                    <!-- Brand Name -->
                    <h1 style=""margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase;"">
                      DIVINE FLAME &amp; ENERGY
                    </h1>
                    <div style=""margin-top: 4px; font-size: 12px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; font-weight: 500;"">
                      International Limited · Engineering Desk
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. BODY CONTENT -->
          <tr>
            <td style=""padding: 36px 32px; background-color: #ffffff;"">

              <!-- Inquiry Title Header -->
              <table width=""100%"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""margin-bottom: 24px;"">
                <tr>
                  <td>
                    <div style=""font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #DD9933; margin-bottom: 6px;"">
                      Subject / Requirement
                    </div>
                    <h2 style=""margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;"">
                      {System.Net.WebUtility.HtmlEncode(s.Subject)}
                    </h2>
                  </td>
                </tr>
              </table>

              <!-- CLIENT DETAILS CARD (Clean Table) -->
              <table width=""100%"" border=""0"" cellpadding=""0"" cellspacing=""0"" style=""background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 28px; overflow: hidden;"">
                <tr>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; width: 35%; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;"">
                    Client Name
                  </td>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #0f172a;"">
                    {System.Net.WebUtility.HtmlEncode(s.Name)}
                  </td>
                </tr>
                <tr>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;"">
                    Corporate Email
                  </td>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;"">
                    <a href=""mailto:{System.Net.WebUtility.HtmlEncode(s.Email)}"" style=""color: #DD9933; text-decoration: none; font-weight: 700;"">
                      {System.Net.WebUtility.HtmlEncode(s.Email)}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;"">
                    Phone Number
                  </td>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;"">
                    {System.Net.WebUtility.HtmlEncode(phone)}
                  </td>
                </tr>
                <tr>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;"">
                    Service Area
                  </td>
                  <td style=""padding: 14px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 700; color: #b45309;"">
                    {System.Net.WebUtility.HtmlEncode(service)}
                  </td>
                </tr>
                <tr>
                  <td style=""padding: 14px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;"">
                    Timestamp
                  </td>
                  <td style=""padding: 14px 18px; font-size: 13px; font-weight: 600; color: #475569; font-family: monospace, sans-serif;"">
                    {formattedDate}
                  </td>
                </tr>
              </table>

              <!-- MESSAGE BODY -->
              <div style=""font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;"">
                Client Message / Technical Scope
              </div>
              <div style=""background-color: #fdfdfd; border: 1px solid #e2e8f0; border-left: 4px solid #DD9933; border-radius: 8px; padding: 20px; font-size: 14px; line-height: 1.65; color: #1e293b; white-space: pre-wrap; margin-bottom: 30px;"">
{System.Net.WebUtility.HtmlEncode(s.Message)}
              </div>

              <!-- PRIMARY ACTION BUTTON -->
              <table width=""100%"" border=""0"" cellpadding=""0"" cellspacing=""0"">
                <tr>
                  <td align=""center"">
                    <a href=""{replyMailto}"" style=""display: inline-block; background-color: #DD9933; color: #151821; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(221, 153, 51, 0.35);"">
                      ✉ Reply to {System.Net.WebUtility.HtmlEncode(s.Name)}
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- 3. COMPLIANCE & GOVERNANCE FOOTER -->
          <tr>
            <td style=""background-color: #11141c; padding: 28px 32px; text-align: center; border-top: 1px solid #1f2633;"">
              <div style=""font-size: 13px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.5px;"">
                Divine Flame and Energy International Limited
              </div>
              <div style=""font-size: 11px; color: #94a3b8; margin-top: 6px; line-height: 1.5;"">
                Headquarters: Plot 12 Commercial Block, Victoria Island, Lagos, Nigeria<br />
                Field Workshop: KM 20, Aba Port-Harcourt Express Way, By Timber Bus Stop, Oyigbo, Port-Harcourt, Nigeria
              </div>

              <!-- ISO Badges Row -->
              <div style=""margin-top: 16px; padding-top: 14px; border-top: 1px solid #1f2633;"">
                <span style=""display: inline-block; font-size: 10px; font-weight: 700; color: #DD9933; background-color: rgba(221, 153, 51, 0.1); border: 1px solid rgba(221, 153, 51, 0.3); border-radius: 4px; padding: 2px 8px; margin: 2px;"">
                  ISO 9001:2015
                </span>
                <span style=""display: inline-block; font-size: 10px; font-weight: 700; color: #DD9933; background-color: rgba(221, 153, 51, 0.1); border: 1px solid rgba(221, 153, 51, 0.3); border-radius: 4px; padding: 2px 8px; margin: 2px;"">
                  ISO 14001:2015
                </span>
                <span style=""display: inline-block; font-size: 10px; font-weight: 700; color: #DD9933; background-color: rgba(221, 153, 51, 0.1); border: 1px solid rgba(221, 153, 51, 0.3); border-radius: 4px; padding: 2px 8px; margin: 2px;"">
                  ISO 45001:2018
                </span>
                <span style=""display: inline-block; font-size: 10px; font-weight: 700; color: #DD9933; background-color: rgba(221, 153, 51, 0.1); border: 1px solid rgba(221, 153, 51, 0.3); border-radius: 4px; padding: 2px 8px; margin: 2px;"">
                  NCDMB Category 1
                </span>
              </div>

              <div style=""font-size: 10px; color: #64748b; margin-top: 14px;"">
                Confidentiality Notice: This communication is intended solely for Divine Flame &amp; Energy operations personnel.
              </div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>";
    }
}
