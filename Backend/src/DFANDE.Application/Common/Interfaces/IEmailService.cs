using DFANDE.Domain.Entities;

namespace DFANDE.Application.Common.Interfaces;

public interface IEmailService
{
    Task SendContactNotificationEmailAsync(ContactSubmission submission, CancellationToken cancellationToken = default);
}
