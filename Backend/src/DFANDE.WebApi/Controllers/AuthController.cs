using DFANDE.Application.Features.Auth.Commands.Login;
using DFANDE.WebApi.Common;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DFANDE.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(ISender sender) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<object>>> Login(LoginRequest request, CancellationToken cancellationToken)
    {
        var result = await sender.Send(new LoginCommand(request.Email, request.Password), cancellationToken);

        if (!result.Succeeded)
        {
            return Unauthorized(ApiErrorResponse.Fail("Invalid email or password."));
        }

        return Ok(ApiResponse<object>.Ok(new
        {
            token = result.Token,
            displayName = result.DisplayName,
            roles = result.Roles,
        }));
    }
}

public record LoginRequest(string Email, string Password);
