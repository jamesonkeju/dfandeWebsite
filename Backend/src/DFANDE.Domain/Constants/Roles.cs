namespace DFANDE.Domain.Constants;

public static class Roles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Administrator = "Administrator";
    public const string Editor = "Editor";

    public static readonly string[] All = [SuperAdmin, Administrator, Editor];
}
