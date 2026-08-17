using DFANDE.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.ContentBlocks.Queries.GetContentBlocks;

/// <summary>
/// Public — every content block, flat. There's no draft/publish split for
/// site copy (unlike Services/Products/Projects) so one endpoint serves
/// both the public site's renderers and the admin editor.
/// </summary>
public record GetContentBlocksQuery : IRequest<List<ContentBlockDto>>;

public class GetContentBlocksQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetContentBlocksQuery, List<ContentBlockDto>>
{
    public async Task<List<ContentBlockDto>> Handle(GetContentBlocksQuery request, CancellationToken cancellationToken)
    {
        return await context.ContentBlocks
            .OrderBy(c => c.PageGroup).ThenBy(c => c.DisplayOrder)
            .Select(c => new ContentBlockDto(
                c.Id, c.Key, c.PageGroup, c.ValueType.ToString(), c.DisplayLabel, c.HelpText, c.DisplayOrder,
                c.TextValue, c.ListValue, c.JsonValue))
            .ToListAsync(cancellationToken);
    }
}
