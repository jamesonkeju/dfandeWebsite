using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DFANDE.Infrastructure.Persistence.Configurations;

public class ServiceConfiguration : IEntityTypeConfiguration<Service>
{
    public void Configure(EntityTypeBuilder<Service> builder)
    {
        builder.ToTable("Services");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Slug).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Summary).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Icon).IsRequired().HasMaxLength(50);
        builder.Property(x => x.ImageUrl).HasMaxLength(500);

        builder.Property(x => x.Scope)
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => string.IsNullOrEmpty(v) ? new List<string>() : (System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>()));


        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => x.DisplayOrder);
    }
}
