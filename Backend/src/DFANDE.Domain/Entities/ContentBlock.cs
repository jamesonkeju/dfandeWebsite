using DFANDE.Domain.Common;
using DFANDE.Domain.Enums;

namespace DFANDE.Domain.Entities;

/// <summary>
/// A single piece of editable site copy, keyed by a fixed dot-namespaced
/// string (e.g. "home.hero.eyebrow"). Keys are seeded once by
/// ContentBlockSeeder and never created/deleted through the CMS — only
/// their values change. Exactly one of TextValue/ListValue/JsonValue is
/// populated, matching ValueType.
/// </summary>
public class ContentBlock : BaseEntity
{
    public string Key { get; private set; } = default!;
    public string PageGroup { get; private set; } = default!;
    public ContentValueType ValueType { get; private set; }
    public string? TextValue { get; private set; }
    public List<string>? ListValue { get; private set; }
    public string? JsonValue { get; private set; }
    public string DisplayLabel { get; private set; } = default!;
    public string? HelpText { get; private set; }
    public int DisplayOrder { get; private set; }

    private ContentBlock() { }

    public static ContentBlock CreateText(
        string key, string pageGroup, ContentValueType valueType, string textValue,
        string displayLabel, string? helpText, int displayOrder)
    {
        return new ContentBlock
        {
            Key = key,
            PageGroup = pageGroup,
            ValueType = valueType,
            TextValue = textValue,
            DisplayLabel = displayLabel,
            HelpText = helpText,
            DisplayOrder = displayOrder,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public static ContentBlock CreateList(
        string key, string pageGroup, List<string> listValue,
        string displayLabel, string? helpText, int displayOrder)
    {
        return new ContentBlock
        {
            Key = key,
            PageGroup = pageGroup,
            ValueType = ContentValueType.List,
            ListValue = listValue,
            DisplayLabel = displayLabel,
            HelpText = helpText,
            DisplayOrder = displayOrder,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public static ContentBlock CreateJson(
        string key, string pageGroup, string jsonValue,
        string displayLabel, string? helpText, int displayOrder)
    {
        return new ContentBlock
        {
            Key = key,
            PageGroup = pageGroup,
            ValueType = ContentValueType.Json,
            JsonValue = jsonValue,
            DisplayLabel = displayLabel,
            HelpText = helpText,
            DisplayOrder = displayOrder,
            CreatedAt = DateTimeOffset.UtcNow,
        };
    }

    public void SetTextValue(string textValue)
    {
        TextValue = textValue;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetListValue(List<string> listValue)
    {
        ListValue = listValue;
        UpdatedAt = DateTimeOffset.UtcNow;
    }

    public void SetJsonValue(string jsonValue)
    {
        JsonValue = jsonValue;
        UpdatedAt = DateTimeOffset.UtcNow;
    }
}
