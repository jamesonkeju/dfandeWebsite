namespace DFANDE.Domain.Enums;

/// <summary>
/// Discriminates how a ContentBlock's value is stored and rendered.
/// PlainText/RichText use TextValue (RichText holds sanitized HTML, the
/// only kind ever passed to dangerouslySetInnerHTML on the public site).
/// List uses ListValue (a jsonb string array). Json uses JsonValue (an
/// opaque jsonb blob whose shape is enforced client-side only, via a
/// per-key manifest — not by the backend).
/// </summary>
public enum ContentValueType
{
    PlainText = 0,
    RichText = 1,
    List = 2,
    Json = 3,
}
