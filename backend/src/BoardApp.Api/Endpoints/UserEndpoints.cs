using BoardApp.Api.Services;

namespace BoardApp.Api.Endpoints;

public static class UserEndpoints
{
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/users", (UserService service) => service.GetAllAsync());

        return app;
    }
}