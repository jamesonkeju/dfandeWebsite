using DFANDE.Domain.Common;

namespace DFANDE.Domain.Entities;

public class Service : BaseEntity
{
    public string Title { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
    public string Summary { get; private set; } = default!;
    public List<string> Scope { get; private set; } = [];
    public string Icon { get; private set; } = default!;
    public string? ImageUrl { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsFeatured { get; private set; }
    public bool IsPublished { get; private set; }

    private Service() { }

    public static Service Create(
        string title,
        string slug,
        string summary,
        List<string> scope,
        string icon,
        string? imageUrl,
        int displayOrder,
        bool isFeatured,
        bool isPublished)
    {
        return new Service
        {
            Title = title,
            Slug = slug,
            Summary = summary,
            Scope = scope,
            Icon = icon,
            ImageUrl = imageUrl,
            DisplayOrder = displayOrder,
            IsFeatured = isFeatured,
            IsPublished = isPublished,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public void Update(
        string title,
        string slug,
        string summary,
        List<string> scope,
        string icon,
        string? imageUrl,
        int displayOrder,
        bool isFeatured)
    {
        Title = title;
        Slug = slug;
        Summary = summary;
        Scope = scope;
        Icon = icon;
        ImageUrl = imageUrl;
        DisplayOrder = displayOrder;
        IsFeatured = isFeatured;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Publish() => IsPublished = true;

    public void Unpublish() => IsPublished = false;
}
