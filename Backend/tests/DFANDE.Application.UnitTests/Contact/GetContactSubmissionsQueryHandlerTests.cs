using DFANDE.Application.Features.Contact.Queries.GetContactSubmissions;
using DFANDE.Domain.Entities;
using DFANDE.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DFANDE.Application.UnitTests.Contact;

public class GetContactSubmissionsQueryHandlerTests
{
    private static ApplicationDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task Returns_submissions_newest_first()
    {
        using var context = CreateInMemoryContext();

        var older = ContactSubmission.Create("A", "a@example.com", "Older", "msg", null, null);
        older.CreatedAt = DateTimeOffset.UtcNow.AddDays(-1);

        var newer = ContactSubmission.Create("B", "b@example.com", "Newer", "msg", null, null);

        context.ContactSubmissions.AddRange(older, newer);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new GetContactSubmissionsQueryHandler(context);
        var result = await handler.Handle(new GetContactSubmissionsQuery(), CancellationToken.None);

        result.Should().HaveCount(2);
        result[0].Subject.Should().Be("Newer");
        result[1].Subject.Should().Be("Older");
    }

    [Fact]
    public async Task Returns_empty_list_when_no_submissions_exist()
    {
        using var context = CreateInMemoryContext();
        var handler = new GetContactSubmissionsQueryHandler(context);

        var result = await handler.Handle(new GetContactSubmissionsQuery(), CancellationToken.None);

        result.Should().BeEmpty();
    }
}
