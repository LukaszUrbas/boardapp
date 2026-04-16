using BoardApp.Api.DTOs.Projects;
using BoardApp.Api.Services;

namespace BoardApp.Api.Endpoints;

public static class ProjectEndpoints
{
    public static IEndpointRouteBuilder MapProjectEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/projects", (ProjectService service) => service.GetAllAsync());
        app.MapGet("/projects/{id:int}", (int id, ProjectService service) => service.GetByIdAsync(id));
        app.MapPost("/projects", (ProjectRequest request, ProjectService service) => service.CreateAsync(request));
        app.MapPut("/projects/{id:int}", (int id, ProjectUpdateRequest request, ProjectService service) => service.UpdateAsync(id, request));
        app.MapDelete("/projects/{id:int}", (int id, ProjectService service) => service.DeleteAsync(id));

        return app;
    }
}