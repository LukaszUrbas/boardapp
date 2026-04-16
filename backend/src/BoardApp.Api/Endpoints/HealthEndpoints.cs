using BoardApp.Api.Services;

namespace BoardApp.Api.Endpoints;

public static class HealthEndpoints
{
    public static IEndpointRouteBuilder MapHealthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", (HealthService service) => service.GetHealthAsync());

        return app;
    }
}