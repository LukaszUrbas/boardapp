using BoardApp.Api.DTOs.SubProjects;
using BoardApp.Api.Services;

namespace BoardApp.Api.Endpoints;

public static class SubProjectEndpoints
{
    public static IEndpointRouteBuilder MapSubProjectEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/projects/{projectId:int}/subprojects", (int projectId, SubProjectService service) => service.GetByProjectIdAsync(projectId));
        app.MapGet("/subprojects/{id:int}", (int id, SubProjectService service) => service.GetByIdAsync(id));
        app.MapPost("/projects/{projectId:int}/subprojects", (int projectId, SubProjectRequest request, SubProjectService service) => service.CreateAsync(projectId, request));
        app.MapPut("/subprojects/{id:int}", (int id, SubProjectUpdateRequest request, SubProjectService service) => service.UpdateAsync(id, request));
        app.MapDelete("/subprojects/{id:int}", (int id, SubProjectService service) => service.DeleteAsync(id));

        return app;
    }
}