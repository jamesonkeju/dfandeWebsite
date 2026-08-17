using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Features.Contact.Commands.UpdateContactSubmissionStatus;
using DFANDE.Domain.Entities;
using DFANDE.Domain.Enums;
using DFANDE.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DFANDE.Application.UnitTests.Contact;

public class UpdateContactSubmissionStatusCommandHandlerTests
{
    private static ApplicationDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Theory]
    [InlineData(ContactSubmissionStatus.Read)]
    [InlineData(ContactSubmissionStatus.Responded)]
    [InlineData(ContactSubmissionStatus.Archived)]
    public async Task Updates_status_to_the_requested_value(ContactSubmissionStatus target)
    {
        using var context = CreateInMemoryContext();
        var submission = ContactSubmission.Create("A", "a@example.com", "Subject", "msg", null, null);
        context.ContactSubmissions.Add(submission);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new UpdateContactSubmissionStatusCommandHandler(context);
        await handler.Handle(new UpdateContactSubmissionStatusCommand(submission.Id, target), CancellationToken.None);

        var updated = await context.ContactSubmissions.SingleAsync();
        updated.Status.Should().Be(target);
    }

    [Fact]
    public async Task Throws_not_found_for_an_unknown_id()
    {
        using var context = CreateInMemoryContext();
        var handler = new UpdateContactSubmissionStatusCommandHandler(context);

        var act = () => handler.Handle(
            new UpdateContactSubmissionStatusCommand(Guid.NewGuid(), ContactSubmissionStatus.Read),
            CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task Rejects_setting_status_back_to_New()
    {
        using var context = CreateInMemoryContext();
        var submission = ContactSubmission.Create("A", "a@example.com", "Subject", "msg", null, null);
        context.ContactSubmissions.Add(submission);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new UpdateContactSubmissionStatusCommandHandler(context);

        var act = () => handler.Handle(
            new UpdateContactSubmissionStatusCommand(submission.Id, ContactSubmissionStatus.New),
            CancellationToken.None);

        await act.Should().ThrowAsync<DFANDE.Application.Common.Exceptions.ValidationException>();
    }
}
