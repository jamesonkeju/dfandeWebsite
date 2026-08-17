using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Commands.UpdateService;

public record UpdateServiceCommand(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    List<string> Scope,
    string Icon,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured) : IRequest;

public class UpdateServiceCommandHandler(IApplicationDbContext context) : IRequestHandler<UpdateServiceCommand>
{
    public async Task Handle(UpdateServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await context.Services.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Service), request.Id);

        var slugTaken = await context.Services
            .AnyAsync(s => s.Slug == request.Slug && s.Id != request.Id, cancellationToken);
        if (slugTaken)
        {
            throw new Common.Exceptions.ValidationException([
                new FluentValidation.Results.ValidationFailure(nameof(request.Slug), "A service with this slug already exists."),
            ]);
        }

        service.Update(
            request.Title, request.Slug, request.Summary, request.Scope, request.Icon,
            request.ImageUrl, request.DisplayOrder, request.IsFeatured);

        await context.SaveChangesAsync(cancellationToken);
    }
}
