using Microsoft.AspNetCore.Identity;

namespace DFANDE.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = default!;
}
