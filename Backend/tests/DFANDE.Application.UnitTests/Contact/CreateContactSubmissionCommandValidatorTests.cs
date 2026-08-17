using DFANDE.Application.Features.Contact.Commands.CreateContactSubmission;
using FluentAssertions;
using Xunit;

namespace DFANDE.Application.UnitTests.Contact;

public class CreateContactSubmissionCommandValidatorTests
{
    private readonly CreateContactSubmissionCommandValidator _validator = new();

    private static CreateContactSubmissionCommand ValidCommand() => new(
        Name: "Adeyinka Freeman",
        Email: "adeyinka@example.com",
        Subject: "Wellhead maintenance inquiry",
        Message: "We need a quote for wellhead control panel maintenance.",
        Phone: "+234 803 000 0000",
        ServiceOfInterest: "Wellhead & Xmas Tree Services");

    [Fact]
    public void Valid_command_passes()
    {
        var result = _validator.Validate(ValidCommand());
        result.IsValid.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void Empty_name_fails(string name)
    {
        var command = ValidCommand() with { Name = name };
        var result = _validator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(command.Name));
    }

    [Theory]
    [InlineData("not-an-email")]
    [InlineData("missing-at-sign.com")]
    [InlineData("")]
    public void Invalid_email_fails(string email)
    {
        var command = ValidCommand() with { Email = email };
        var result = _validator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(command.Email));
    }

    [Fact]
    public void Empty_message_fails()
    {
        var command = ValidCommand() with { Message = "" };
        var result = _validator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(command.Message));
    }

    [Fact]
    public void Message_over_max_length_fails()
    {
        var command = ValidCommand() with { Message = new string('a', 5001) };
        var result = _validator.Validate(command);
        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Null_phone_and_service_are_allowed()
    {
        var command = ValidCommand() with { Phone = null, ServiceOfInterest = null };
        var result = _validator.Validate(command);
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void Phone_with_letters_fails()
    {
        var command = ValidCommand() with { Phone = "call-me-maybe" };
        var result = _validator.Validate(command);
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(command.Phone));
    }
}
