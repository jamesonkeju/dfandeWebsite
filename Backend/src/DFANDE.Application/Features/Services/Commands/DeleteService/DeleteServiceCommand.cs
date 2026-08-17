using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.Services.Commands.DeleteService;

public record DeleteServiceCommand(Guid Id) : IRequest;

public class DeleteServiceCommandHandler(IApplicationDbContext context) : IRequestHandler<DeleteServiceCommand>
{
    public async Task Handle(DeleteServiceCommand request, CancellationToken cancellationToken)
    {
        var service = await context.Services.FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Domain.Entities.Service), request.Id);

        context.Services.Remove(service);
        await context.SaveChangesAsync(cancellationToken);
    }
}
