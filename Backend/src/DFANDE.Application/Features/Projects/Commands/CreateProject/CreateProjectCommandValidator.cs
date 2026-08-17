using DFANDE.Domain.Constants;
using FluentValidation;

namespace DFANDE.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectCommandValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectCommandValidator()
    {
        RuleFor(x => x.Client).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Scope).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Year).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Category)
            .NotEmpty()
            .Must(ProjectCategories.All.Contains)
            .WithMessage($"Category must be one of: {string.Join(", ", ProjectCategories.All)}.");
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
    }
}
