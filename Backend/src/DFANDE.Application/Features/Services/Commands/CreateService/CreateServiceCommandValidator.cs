using FluentValidation;

namespace DFANDE.Application.Features.Services.Commands.CreateService;

public class CreateServiceCommandValidator : AbstractValidator<CreateServiceCommand>
{
    public CreateServiceCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .Matches("^[a-z0-9]+(-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, and hyphen-separated (e.g. 'choke-valve').");
        RuleFor(x => x.Summary).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Icon).NotEmpty().MaximumLength(50);
        RuleFor(x => x.ImageUrl).MaximumLength(500);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
        RuleForEach(x => x.Scope).NotEmpty().MaximumLength(300);
    }
}
