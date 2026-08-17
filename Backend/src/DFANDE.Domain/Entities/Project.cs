using DFANDE.Domain.Common;

namespace DFANDE.Domain.Entities;

public class Project : BaseEntity
{
    public string Client { get; private set; } = default!;
    public string Scope { get; private set; } = default!;
    public string Location { get; private set; } = default!;
    public string Year { get; private set; } = default!;
    public string Category { get; private set; } = default!;
    public string? ImageUrl { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsFeatured { get; private set; }
    public bool IsPublished { get; private set; }

    private Project() { }

    public static Project Create(
        string client,
        string scope,
        string location,
        string year,
        string category,
        string? imageUrl,
        int displayOrder,
        bool isFeatured,
        bool isPublished)
    {
        return new Project
        {
            Client = client,
            Scope = scope,
            Location = location,
            Year = year,
            Category = category,
            ImageUrl = imageUrl,
            DisplayOrder = displayOrder,
            IsFeatured = isFeatured,
            IsPublished = isPublished,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public void Update(
        string client,
        string scope,
        string location,
        string year,
        string category,
        string? imageUrl,
        int displayOrder,
        bool isFeatured)
    {
        Client = client;
        Scope = scope;
        Location = location;
        Year = year;
        Category = category;
        ImageUrl = imageUrl;
        DisplayOrder = displayOrder;
        IsFeatured = isFeatured;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void Publish() => IsPublished = true;

    public void Unpublish() => IsPublished = false;
}
