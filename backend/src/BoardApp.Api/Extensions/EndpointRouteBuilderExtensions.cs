using BoardApp.Api.Endpoints;

namespace BoardApp.Api.Extensions;

public static class EndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapBoardAppEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapUserEndpoints();
        app.MapProjectEndpoints();
        app.MapSubProjectEndpoints();
        app.MapTaskEndpoints();
        app.MapHealthEndpoints();

        return app;
    }
}