using BoardApp.Api.Endpoints;

namespace BoardApp.Api.Extensions;

public static class EndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapBoardAppEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAuthEndpoints();

        var secured = app.MapGroup(string.Empty).RequireAuthorization();
        secured.MapUserEndpoints();
        secured.MapProjectEndpoints();
        secured.MapSubProjectEndpoints();
        secured.MapTaskEndpoints();

        app.MapHealthEndpoints();

        return app;
    }
}