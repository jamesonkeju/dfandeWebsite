namespace DFANDE.Application.Features.Products;

public record ProductDto(
    Guid Id,
    string Title,
    string Slug,
    List<string> Items,
    string? Application,
    string? ImageUrl,
    int DisplayOrder,
    bool IsPublished);
