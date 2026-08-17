using DFANDE.Application.Common.Exceptions;
using DFANDE.Application.Features.Services.Commands.CreateService;
using DFANDE.Application.Features.Services.Commands.DeleteService;
using DFANDE.Application.Features.Services.Commands.SetServicePublished;
using DFANDE.Application.Features.Services.Commands.UpdateService;
using DFANDE.Application.Features.Services.Queries.GetAllServices;
using DFANDE.Application.Features.Services.Queries.GetPublishedServices;
using DFANDE.Domain.Entities;
using DFANDE.Infrastructure.Persistence;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace DFANDE.Application.UnitTests.Services;

public class ServiceHandlerTests
{
    private static ApplicationDbContext CreateInMemoryContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    private static CreateServiceCommand ValidCreateCommand(string slug = "choke-valve") => new(
        Title: "Choke Valve Services",
        Slug: slug,
        Summary: "Choke valve installation and repair.",
        Scope: ["Installation", "Repair"],
        Icon: "gauge",
        ImageUrl: "/images/service-valve.png",
        DisplayOrder: 0,
        IsFeatured: true,
        IsPublished: true);

    [Fact]
    public async Task CreateService_persists_and_returns_id()
    {
        using var context = CreateInMemoryContext();
        var handler = new CreateServiceCommandHandler(context);

        var id = await handler.Handle(ValidCreateCommand(), CancellationToken.None);

        var saved = await context.Services.SingleAsync();
        saved.Id.Should().Be(id);
        saved.Scope.Should().BeEquivalentTo(["Installation", "Repair"]);
    }

    [Fact]
    public async Task CreateService_rejects_duplicate_slug()
    {
        using var context = CreateInMemoryContext();
        var handler = new CreateServiceCommandHandler(context);
        await handler.Handle(ValidCreateCommand("choke-valve"), CancellationToken.None);

        var act = () => handler.Handle(ValidCreateCommand("choke-valve"), CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>();
    }

    [Fact]
    public async Task UpdateService_changes_fields()
    {
        using var context = CreateInMemoryContext();
        var service = Service.Create("Old Title", "old-slug", "Old summary", ["A"], "gauge", null, 0, false, true);
        context.Services.Add(service);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new UpdateServiceCommandHandler(context);
        await handler.Handle(
            new UpdateServiceCommand(service.Id, "New Title", "new-slug", "New summary", ["A", "B"], "flame", null, 1, true),
            CancellationToken.None);

        var updated = await context.Services.SingleAsync();
        updated.Title.Should().Be("New Title");
        updated.Slug.Should().Be("new-slug");
        updated.Scope.Should().BeEquivalentTo(["A", "B"]);
        updated.IsFeatured.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateService_throws_not_found_for_unknown_id()
    {
        using var context = CreateInMemoryContext();
        var handler = new UpdateServiceCommandHandler(context);

        var act = () => handler.Handle(
            new UpdateServiceCommand(Guid.NewGuid(), "T", "s", "S", [], "gauge", null, 0, false),
            CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Fact]
    public async Task DeleteService_removes_the_row()
    {
        using var context = CreateInMemoryContext();
        var service = Service.Create("T", "s", "S", [], "gauge", null, 0, false, true);
        context.Services.Add(service);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new DeleteServiceCommandHandler(context);
        await handler.Handle(new DeleteServiceCommand(service.Id), CancellationToken.None);

        (await context.Services.AnyAsync()).Should().BeFalse();
    }

    [Fact]
    public async Task SetServicePublished_toggles_published_state()
    {
        using var context = CreateInMemoryContext();
        var service = Service.Create("T", "s", "S", [], "gauge", null, 0, false, isPublished: true);
        context.Services.Add(service);
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new SetServicePublishedCommandHandler(context);
        await handler.Handle(new SetServicePublishedCommand(service.Id, false), CancellationToken.None);

        (await context.Services.SingleAsync()).IsPublished.Should().BeFalse();
    }

    [Fact]
    public async Task GetPublishedServices_excludes_unpublished_and_orders_by_display_order()
    {
        using var context = CreateInMemoryContext();
        context.Services.AddRange(
            Service.Create("Second", "second", "S", [], "gauge", null, 1, false, true),
            Service.Create("Hidden", "hidden", "S", [], "gauge", null, 0, false, isPublished: false),
            Service.Create("First", "first", "S", [], "gauge", null, 0, false, true));
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new GetPublishedServicesQueryHandler(context);
        var result = await handler.Handle(new GetPublishedServicesQuery(), CancellationToken.None);

        result.Select(s => s.Slug).Should().Equal("first", "second");
    }

    [Fact]
    public async Task GetAllServices_includes_unpublished()
    {
        using var context = CreateInMemoryContext();
        context.Services.Add(Service.Create("Hidden", "hidden", "S", [], "gauge", null, 0, false, isPublished: false));
        await context.SaveChangesAsync(CancellationToken.None);

        var handler = new GetAllServicesQueryHandler(context);
        var result = await handler.Handle(new GetAllServicesQuery(), CancellationToken.None);

        result.Should().ContainSingle(s => s.Slug == "hidden");
    }
}
