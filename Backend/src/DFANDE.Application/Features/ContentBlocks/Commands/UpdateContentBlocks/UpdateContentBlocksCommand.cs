using DFANDE.Application.Common.Interfaces;
using DFANDE.Domain.Enums;
using Ganss.Xss;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Features.ContentBlocks.Commands.UpdateContentBlocks;

public record ContentBlockUpdateItem(string Key, string? TextValue, List<string>? ListValue, string? JsonValue);

public record UpdateContentBlocksCommand(string PageGroup, List<ContentBlockUpdateItem> Blocks)
    : IRequest<List<ContentBlockDto>>;

public class UpdateContentBlocksCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateContentBlocksCommand, List<ContentBlockDto>>
{
    // A single shared, restrictive allow-list — only the formatting the
    // TipTap toolbar can actually produce (bold/italic/link/bullet list).
    // Anything else (script, style, event handlers, iframes, etc.) is
    // stripped. This is the only place RichText values are ever persisted.
    private static readonly HtmlSanitizer Sanitizer = new(new HtmlSanitizerOptions
    {
        AllowedTags = new HashSet<string> { "p", "strong", "em", "a", "ul", "ol", "li", "br" },
        AllowedAttributes = new HashSet<string> { "href" },
        AllowedSchemes = new HashSet<string> { "http", "https", "mailto" },
    });

    public async Task<List<ContentBlockDto>> Handle(UpdateContentBlocksCommand request, CancellationToken cancellationToken)
    {
        var keys = request.Blocks.Select(b => b.Key).ToList();
        var blocks = await context.ContentBlocks
            .Where(c => c.PageGroup == request.PageGroup && keys.Contains(c.Key))
            .ToListAsync(cancellationToken);

        var byKey = blocks.ToDictionary(b => b.Key);

        foreach (var item in request.Blocks)
        {
            if (!byKey.TryGetValue(item.Key, out var block))
            {
                throw new Common.Exceptions.ValidationException([
                    new FluentValidation.Results.ValidationFailure(item.Key, $"Unknown content block key '{item.Key}'."),
                ]);
            }

            switch (block.ValueType)
            {
                case ContentValueType.PlainText:
                    if (item.TextValue is null)
                    {
                        throw new Common.Exceptions.ValidationException([
                            new FluentValidation.Results.ValidationFailure(item.Key, "textValue is required for a PlainText block."),
                        ]);
                    }
                    block.SetTextValue(item.TextValue);
                    break;

                case ContentValueType.RichText:
                    if (item.TextValue is null)
                    {
                        throw new Common.Exceptions.ValidationException([
                            new FluentValidation.Results.ValidationFailure(item.Key, "textValue is required for a RichText block."),
                        ]);
                    }
                    block.SetTextValue(Sanitizer.Sanitize(item.TextValue));
                    break;

                case ContentValueType.List:
                    if (item.ListValue is null)
                    {
                        throw new Common.Exceptions.ValidationException([
                            new FluentValidation.Results.ValidationFailure(item.Key, "listValue is required for a List block."),
                        ]);
                    }
                    block.SetListValue(item.ListValue);
                    break;

                case ContentValueType.Json:
                    if (item.JsonValue is null)
                    {
                        throw new Common.Exceptions.ValidationException([
                            new FluentValidation.Results.ValidationFailure(item.Key, "jsonValue is required for a Json block."),
                        ]);
                    }
                    block.SetJsonValue(item.JsonValue);
                    break;
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        return blocks
            .Select(c => new ContentBlockDto(
                c.Id, c.Key, c.PageGroup, c.ValueType.ToString(), c.DisplayLabel, c.HelpText, c.DisplayOrder,
                c.TextValue, c.ListValue, c.JsonValue))
            .ToList();
    }
}
