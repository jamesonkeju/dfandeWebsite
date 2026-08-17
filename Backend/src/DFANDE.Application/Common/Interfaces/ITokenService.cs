namespace DFANDE.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(AuthenticatedUser user);
}
