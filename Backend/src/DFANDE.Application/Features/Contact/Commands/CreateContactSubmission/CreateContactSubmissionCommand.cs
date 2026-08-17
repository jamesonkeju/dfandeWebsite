using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using MediatR;

namespace DFANDE.Application.Features.Contact.Commands.CreateContactSubmission;

public record CreateContactSubmissionCommand(
    string Name,
    string Email,
    string Subject,
    string Message,
    string? Phone,
    string? ServiceOfInterest) : IRequest<Guid>;

public class CreateContactSubmissionCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateContactSubmissionCommand, Guid>
{
    public async Task<Guid> Handle(CreateContactSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = ContactSubmission.Create(
            name: request.Name,
            email: request.Email,
            subject: request.Subject,
            message: request.Message,
            phone: request.Phone,
            serviceOfInterest: request.ServiceOfInterest);

        context.ContactSubmissions.Add(submission);
        await context.SaveChangesAsync(cancellationToken);

        return submission.Id;
    }
}
