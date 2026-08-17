using FluentValidation;

namespace DFANDE.Application.Features.Contact.Commands.CreateContactSubmission;

public class CreateContactSubmissionCommandValidator : AbstractValidator<CreateContactSubmissionCommand>
{
    public CreateContactSubmissionCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(320);

        RuleFor(x => x.Subject)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Message)
            .NotEmpty()
            .MaximumLength(5000);

        RuleFor(x => x.Phone)
            .MaximumLength(30)
            .Matches(@"^[\d\s\+\-\(\)]*$")
            .WithMessage("Phone must contain only digits and phone punctuation.")
            .When(x => !string.IsNullOrWhiteSpace(x.Phone));

        RuleFor(x => x.ServiceOfInterest)
            .MaximumLength(200);
    }
}
