using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DFANDE.Infrastructure.Persistence.Configurations;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("Products");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Slug).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Application).HasMaxLength(300);
        builder.Property(x => x.ImageUrl).HasMaxLength(500);

        builder.Property(x => x.Items)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => string.IsNullOrEmpty(v) ? new List<string>() : (System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()));


        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => x.DisplayOrder);
    }
}
