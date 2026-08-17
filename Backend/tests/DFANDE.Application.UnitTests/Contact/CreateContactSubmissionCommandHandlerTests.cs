using DFANDE.Application.Features.Contact.Commands.CreateContactSubmission;
using DFANDE.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DFANDE.Application.UnitTests.Contact;

public class CreateContactSubmissionCommandHandlerTests
{
    private static ApplicationDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task Persists_the_submission_and_returns_its_id()
    {
        using var context = CreateInMemoryContext();
        var handler = new CreateContactSubmissionCommandHandler(context);

        var command = new CreateContactSubmissionCommand(
            Name: "Adeyinka Freeman",
            Email: "adeyinka@example.com",
            Subject: "Wellhead maintenance inquiry",
            Message: "We need a quote for wellhead control panel maintenance.",
            Phone: "+234 803 000 0000",
            ServiceOfInterest: "Wellhead & Xmas Tree Services");

        var id = await handler.Handle(command, CancellationToken.None);

        id.Should().NotBeEmpty();

        var saved = await context.ContactSubmissions.SingleAsync();
        saved.Id.Should().Be(id);
        saved.Name.Should().Be(command.Name);
        saved.Email.Should().Be(command.Email);
        saved.Status.ToString().Should().Be("New");
    }

    [Fact]
    public async Task Allows_optional_fields_to_be_null()
    {
        using var context = CreateInMemoryContext();
        var handler = new CreateContactSubmissionCommandHandler(context);

        var command = new CreateContactSubmissionCommand(
            Name: "Adeyinka Freeman",
            Email: "adeyinka@example.com",
            Subject: "General inquiry",
            Message: "Just saying hello.",
            Phone: null,
            ServiceOfInterest: null);

        await handler.Handle(command, CancellationToken.None);

        var saved = await context.ContactSubmissions.SingleAsync();
        saved.Phone.Should().BeNull();
        saved.ServiceOfInterest.Should().BeNull();
    }
}
