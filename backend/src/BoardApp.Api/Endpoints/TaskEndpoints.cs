using BoardApp.Api.DTOs.Tasks;
using BoardApp.Api.Services;

namespace BoardApp.Api.Endpoints;

public static class TaskEndpoints
{
    public static IEndpointRouteBuilder MapTaskEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/subprojects/{subprojectId:int}/tasks", (int subprojectId, TaskService service) => service.GetBySubProjectIdAsync(subprojectId));
        app.MapGet("/tasks/{id:int}", (int id, TaskService service) => service.GetByIdAsync(id));
        app.MapPost("/subprojects/{subprojectId:int}/tasks", (int subprojectId, TaskRequest request, TaskService service) => service.CreateAsync(subprojectId, request));
        app.MapPut("/tasks/{id:int}", (int id, TaskUpdateRequest request, TaskService service) => service.UpdateAsync(id, request));
        app.MapDelete("/tasks/{id:int}", (int id, TaskService service) => service.DeleteAsync(id));

        return app;
    }
}