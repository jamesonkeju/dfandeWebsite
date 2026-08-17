using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DFANDE.Infrastructure.Persistence.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
    public void Configure(EntityTypeBuilder<Project> builder)
    {
        builder.ToTable("Projects");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Client).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Scope).IsRequired().HasMaxLength(500);
        builder.Property(x => x.Location).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Year).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Category).IsRequired().HasMaxLength(50);
        builder.Property(x => x.ImageUrl).HasMaxLength(500);

        builder.HasIndex(x => x.DisplayOrder);
        builder.HasIndex(x => x.Category);
    }
}
