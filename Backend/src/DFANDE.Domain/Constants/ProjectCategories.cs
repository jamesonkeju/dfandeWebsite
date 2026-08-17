namespace DFANDE.Domain.Constants;

public static class ProjectCategories
{
    public const string Wellhead = "wellhead";
    public const string ControlPanel = "control-panel";
    public const string ChokeValve = "choke-valve";

    public static readonly string[] All = [Wellhead, ControlPanel, ChokeValve];
}
