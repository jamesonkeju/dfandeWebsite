namespace DFANDE.Domain.Constants;

public static class Roles
{
    public const string SuperAdmin = "SuperAdmin";
    public const string Administrator = "SuperAdmin"; // Convenience alias for SuperAdmin
    public const string ContentManager = "ContentManager";
    public const string InquiryViewer = "InquiryViewer";

    public static readonly string[] All = [SuperAdmin, ContentManager, InquiryViewer];
}
