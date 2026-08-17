namespace DFANDE.WebApi.Common;

public record ApiResponse<T>(bool Success, T? Data, string? Message)
{
    public static ApiResponse<T> Ok(T data, string? message = null) => new(true, data, message);
}

public record ApiErrorResponse(bool Success, string Message, IDictionary<string, string[]>? Errors)
{
    public static ApiErrorResponse Fail(string message, IDictionary<string, string[]>? errors = null) =>
        new(false, message, errors);
}
