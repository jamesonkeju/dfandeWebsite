using System.Net;
using DFANDE.Application.Common.Exceptions;
using DFANDE.WebApi.Common;
using ValidationException = DFANDE.Application.Common.Exceptions.ValidationException;

namespace DFANDE.WebApi.Middleware;

/// <summary>
/// Single place all unhandled exceptions funnel through. Callers only ever
/// see a consistent ApiErrorResponse shape — never a stack trace or internal
/// exception detail.
/// </summary>
public class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(
                ApiErrorResponse.Fail("Validation failed.", ex.Errors));
        }
        catch (NotFoundException ex)
        {
            context.Response.StatusCode = (int)HttpStatusCode.NotFound;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(ApiErrorResponse.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception processing {Method} {Path}", context.Request.Method, context.Request.Path);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(
                ApiErrorResponse.Fail("An unexpected error occurred. Please try again later."));
        }
    }
}
