using DFANDE.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DFANDE.Application.Common.Interfaces;

/// <summary>
/// Abstraction the Application layer depends on instead of the concrete
/// EF Core DbContext, which lives in Infrastructure — keeps Application
/// free of any persistence-technology reference.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<ContactSubmission> ContactSubmissions { get; }
    DbSet<Service> Services { get; }
    DbSet<Product> Products { get; }
    DbSet<Project> Projects { get; }
    DbSet<ContentBlock> ContentBlocks { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
