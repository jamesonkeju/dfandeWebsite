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

        // EF Core 8 primitive collection, stored as a jsonb array — same
        // pattern as Service.Scope, no separate child table needed.
        builder.Property(x => x.Items).HasColumnType("jsonb");

        builder.HasIndex(x => x.Slug).IsUnique();
        builder.HasIndex(x => x.DisplayOrder);
    }
}
