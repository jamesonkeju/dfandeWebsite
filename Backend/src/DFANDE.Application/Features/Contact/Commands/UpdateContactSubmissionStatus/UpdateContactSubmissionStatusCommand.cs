using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Contact.Commands.UpdateContactSubmissionStatus;

public record UpdateContactSubmissionStatusCommand(Guid Id, ContactSubmissionStatus Status) : IRequest;

public class UpdateContactSubmissionStatusCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateContactSubmissionStatusCommand>
{
    public async Task Handle(UpdateContactSubmissionStatusCommand request, CancellationToken cancellationToken)
    {
        var submission = await context.ContactSubmissions
            .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

        if (submission is null)
        {
            throw new NotFoundException(nameof(Domain.Entities.ContactSubmission), request.Id);
        }

        switch (request.Status)
        {
            case ContactSubmissionStatus.Read:
                submission.MarkAsRead();
                break;
            case ContactSubmissionStatus.Responded:
                submission.MarkAsResponded();
                break;
            case ContactSubmissionStatus.Archived:
                submission.Archive();
                break;
            default:
                throw new ValidationException([
                    new FluentValidation.Results.ValidationFailure(
                        nameof(request.Status), "Status can only be changed to Read, Responded or Archived."),
                ]);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
