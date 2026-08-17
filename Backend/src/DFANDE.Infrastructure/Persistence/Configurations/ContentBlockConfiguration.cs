using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DFANDE.Infrastructure.Persistence.Configurations;

public class ContentBlockConfiguration : IEntityTypeConfiguration<ContentBlock>
{
    public void Configure(EntityTypeBuilder<ContentBlock> builder)
    {
        builder.ToTable("ContentBlocks");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Key).IsRequired().HasMaxLength(200);
        builder.Property(x => x.PageGroup).IsRequired().HasMaxLength(50);
        builder.Property(x => x.ValueType).IsRequired().HasConversion<string>().HasMaxLength(20);
        builder.Property(x => x.TextValue).HasMaxLength(20_000);
        builder.Property(x => x.JsonValue).HasColumnType("jsonb");
        builder.Property(x => x.ListValue).HasColumnType("jsonb");
        builder.Property(x => x.DisplayLabel).IsRequired().HasMaxLength(200);
        builder.Property(x => x.HelpText).HasMaxLength(500);

        builder.HasIndex(x => x.Key).IsUnique();
        builder.HasIndex(x => x.PageGroup);
    }
}
