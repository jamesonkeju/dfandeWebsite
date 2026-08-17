namespace DFANDE.Application.Features.Services;

public record ServiceDto(
    Guid Id,
    string Title,
    string Slug,
    string Summary,
    List<string> Scope,
    string Icon,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured,
    bool IsPublished);
