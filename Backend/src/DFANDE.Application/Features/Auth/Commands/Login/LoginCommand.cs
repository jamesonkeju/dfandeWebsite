using DFANDE.Application.Common.Interfaces;
using MediatR;

namespace DFANDE.Application.Features.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResult>;

public record LoginResult(bool Succeeded, string? Token, string? DisplayName, IList<string>? Roles);

public class LoginCommandHandler(IIdentityService identityService, ITokenService tokenService)
    : IRequestHandler<LoginCommand, LoginResult>
{
    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await identityService.ValidateCredentialsAsync(request.Email, request.Password);

        if (user is null)
        {
            return new LoginResult(false, null, null, null);
        }

        var token = tokenService.GenerateToken(user);
        return new LoginResult(true, token, user.DisplayName, user.Roles);
    }
}
