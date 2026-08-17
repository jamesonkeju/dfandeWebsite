namespace DFANDE.Application.Features.Contact.Queries.GetContactSubmissions;

public record ContactSubmissionDto(
    Guid Id,
    string Name,
    string Email,
    string? Phone,
    string Subject,
    string Message,
    string? ServiceOfInterest,
    string Status,
    DateTimeOffset CreatedAt);
