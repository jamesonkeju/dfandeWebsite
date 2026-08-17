namespace DFANDE.Application.Features.ContentBlocks;

public record ContentBlockDto(
    Guid Id,
    string Key,
    string PageGroup,
    string ValueType,
    string DisplayLabel,
    string? HelpText,
    int DisplayOrder,
    string? TextValue,
    List<string>? ListValue,
    string? JsonValue);
