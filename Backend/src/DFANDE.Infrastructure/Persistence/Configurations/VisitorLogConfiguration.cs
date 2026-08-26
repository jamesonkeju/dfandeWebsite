using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DFANDE.Infrastructure.Persistence.Configurations;

public class VisitorLogConfiguration : IEntityTypeConfiguration<VisitorLog>
{
    public void Configure(EntityTypeBuilder<VisitorLog> builder)
    {
        builder.ToTable("VisitorLogs");
        builder.HasKey(v => v.Id);

        builder.Property(v => v.SessionId).HasMaxLength(128).IsRequired();
        builder.Property(v => v.Path).HasMaxLength(512).IsRequired();
        builder.Property(v => v.QueryString).HasMaxLength(1024);
        builder.Property(v => v.Referrer).HasMaxLength(1024);
        builder.Property(v => v.UserAgent).HasMaxLength(1024);
        builder.Property(v => v.Browser).HasMaxLength(128).IsRequired();
        builder.Property(v => v.OperatingSystem).HasMaxLength(128).IsRequired();
        builder.Property(v => v.DeviceType).HasMaxLength(64).IsRequired();
        builder.Property(v => v.IpHash).HasMaxLength(128);
        builder.Property(v => v.Country).HasMaxLength(128);
        builder.Property(v => v.City).HasMaxLength(128);

        builder.HasIndex(v => v.TimestampUtc);
        builder.HasIndex(v => v.Path);
        builder.HasIndex(v => v.SessionId);
    }
}
