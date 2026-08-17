namespace DFANDE.Application.Features.Projects;

public record ProjectDto(
    Guid Id,
    string Client,
    string Scope,
    string Location,
    string Year,
    string Category,
    string? ImageUrl,
    int DisplayOrder,
    bool IsFeatured,
    bool IsPublished);
