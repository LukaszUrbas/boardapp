using BoardApp.Api.DTOs.Auth;
using BoardApp.Api.Services;

namespace BoardApp.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/auth/login", (LoginRequest request, AuthService service) => service.LoginAsync(request));

        return app;
    }
}
