using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DFANDE.Infrastructure.Persistence.Configurations;

public class ContactSubmissionConfiguration : IEntityTypeConfiguration<ContactSubmission>
{
    public void Configure(EntityTypeBuilder<ContactSubmission> builder)
    {
        builder.ToTable("ContactSubmissions");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Name).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Email).IsRequired().HasMaxLength(320);
        builder.Property(x => x.Phone).HasMaxLength(30);
        builder.Property(x => x.Subject).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Message).IsRequired().HasMaxLength(5000);
        builder.Property(x => x.ServiceOfInterest).HasMaxLength(200);
        builder.Property(x => x.Status).IsRequired().HasConversion<string>().HasMaxLength(20);

        builder.Property(x => x.CreatedBy).HasMaxLength(200);
        builder.Property(x => x.UpdatedBy).HasMaxLength(200);

        builder.HasIndex(x => x.CreatedAt);
        builder.HasIndex(x => x.Status);
    }
}
