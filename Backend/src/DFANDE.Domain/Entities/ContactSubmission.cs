using DFANDE.Domain.Common;
using DFANDE.Domain.Enums;

namespace DFANDE.Domain.Entities;

public class ContactSubmission : BaseEntity
{
    public string Name { get; private set; } = default!;
    public string Email { get; private set; } = default!;
    public string? Phone { get; private set; }
    public string Subject { get; private set; } = default!;
    public string Message { get; private set; } = default!;
    public string? ServiceOfInterest { get; private set; }
    public ContactSubmissionStatus Status { get; private set; } = ContactSubmissionStatus.New;

    private ContactSubmission() { }

    public static ContactSubmission Create(
        string name,
        string email,
        string subject,
        string message,
        string? phone,
        string? serviceOfInterest)
    {
        return new ContactSubmission
        {
            Name = name,
            Email = email,
            Subject = subject,
            Message = message,
            Phone = phone,
            ServiceOfInterest = serviceOfInterest,
            Status = ContactSubmissionStatus.New,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public void MarkAsRead() => Status = ContactSubmissionStatus.Read;

    public void MarkAsResponded() => Status = ContactSubmissionStatus.Responded;

    public void Archive() => Status = ContactSubmissionStatus.Archived;
}
