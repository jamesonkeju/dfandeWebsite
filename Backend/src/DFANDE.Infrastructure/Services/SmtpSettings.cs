namespace DFANDE.Infrastructure.Services;

public class SmtpSettings
{
    public const string SectionName = "Smtp";

    public string Host { get; set; } = "smtp.ethereal.email";
    public int Port { get; set; } = 587;
    public string Security { get; set; } = "StartTls";
    public string Username { get; set; } = "maria56@ethereal.email";
    public string Password { get; set; } = "Qs3T77c1ByHJU3MH4p";
    public string FromEmail { get; set; } = "noreply@dfande.com";
    public string FromName { get; set; } = "Divine Flame & Energy Portal";
    public string NotificationRecipient { get; set; } = "info@dfande.com";
}
