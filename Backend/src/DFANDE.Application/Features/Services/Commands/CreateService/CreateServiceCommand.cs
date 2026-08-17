using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Commands.CreateService;

public record CreateServiceCommand(
    string Title,
    string Slug,
    string Summary,
    List<string> Scope,
    string Icon,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured,
    bool IsPublished) : IRequest<Guid>;

public class CreateServiceCommandHandler(IApplicationDbContext context) : IRequestHandler<CreateServiceCommand, Guid>
{
    public async Task<Guid> Handle(CreateServiceCommand request, CancellationToken cancellationToken)
    {
        if (await context.Services.AnyAsync(s => s.Slug == request.Slug, cancellationToken))
        {
            throw new Common.Exceptions.ValidationException([
                new FluentValidation.Results.ValidationFailure(nameof(request.Slug), "A service with this slug already exists."),
            ]);
        }

        var service = Service.Create(
            request.Title, request.Slug, request.Summary, request.Scope, request.Icon,
            request.ImageUrl, request.DisplayOrder, request.IsFeatured, request.IsPublished);

        context.Services.Add(service);
        await context.SaveChangesAsync(cancellationToken);

        return service.Id;
    }
}
