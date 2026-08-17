using MediatR;
using Microsoft.Extensions.Logging;

namespace DFANDE.Application.Common.Behaviors;

/// <summary>
/// Logs the start/outcome of every command and query. Never logs full request
/// payloads — some carry personal data (e.g. contact submissions) — only the
/// request type name and timing.
/// </summary>
public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        logger.LogInformation("Handling {RequestName}", requestName);

        try
        {
            var response = await next();
            logger.LogInformation("Handled {RequestName}", requestName);
            return response;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error handling {RequestName}", requestName);
            throw;
        }
    }
}
