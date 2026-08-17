using DFANDE.Domain.Common;

namespace DFANDE.Domain.Entities;

public class Product : BaseEntity
{
    public string Title { get; private set; } = default!;
    public string Slug { get; private set; } = default!;
    public List<string> Items { get; private set; } = [];
    public string? Application { get; private set; }
    public string? ImageUrl { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsPublished { get; private set; }

    private Product() { }

    public static Product Create(
        string title,
        string slug,
        List<string> items,
        string? application,
        string? imageUrl,
        int displayOrder,
        bool isPublished)
    {
        return new Product
        {
            Title = title,
            Slug = slug,
            Items = items,
            Application = application,
            ImageUrl = imageUrl,
            DisplayOrder = displayOrder,
            IsPublished = isPublished,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public void Update(
        string title,
        string slug,
        List<string> items,
        string? application,
        string? imageUrl,
        int displayOrder)
    {
        Title = title;
        Slug = slug;
        Items = items;
        Application = application;
        ImageUrl = imageUrl;
        DisplayOrder = displayOrder;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Publish() => IsPublished = true;

    public void Unpublish() => IsPublished = false;
}
