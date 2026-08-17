using FluentValidation;

namespace DFANDE.Application.Features.Products.Commands.UpdateProduct;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Slug)
            .NotEmpty()
            .MaximumLength(200)
            .Matches("^[a-z0-9]+(-[a-z0-9]+)*$")
            .WithMessage("Slug must be lowercase, alphanumeric, and hyphen-separated (e.g. 'wellhead-equipment').");
        RuleFor(x => x.Application).MaximumLength(300);
        RuleFor(x => x.DisplayOrder).GreaterThanOrEqualTo(0);
        RuleForEach(x => x.Items).NotEmpty().MaximumLength(300);
    }
}
