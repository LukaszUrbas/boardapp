using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Json;
using BoardApp.Api.Data;
using BoardApp.Api.Models;
using BoardApp.Api.DTOs.Projects;
using BoardApp.Api.DTOs.SubProjects;
using BoardApp.Api.DTOs.Tasks;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

var app = builder.Build();

app.UseCors();
app.UseRouting();

var data = new InMemoryStore();

// ===== USER ENDPOINTS =====
app.MapGet("/users", () => Results.Ok(data.Users));

// ===== PROJECT ENDPOINTS =====
app.MapGet("/projects", () => Results.Ok(data.Projects));
app.MapGet("/projects/{id:int}", (int id) =>
{
    var project = data.Projects.SingleOrDefault(p => p.Id == id);
    return project is not null ? Results.Ok(project) : Results.NotFound();
});

app.MapPost("/projects", (ProjectRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest("Project name is required.");

    var project = new Project
    {
        Id = data.NextProjectId++,
        Name = request.Name.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        Status = ProjectStatus.New,
        SubProjects = new()
    };

    data.Projects.Add(project);
    return Results.Created($"/projects/{project.Id}", project);
});

app.MapPut("/projects/{id:int}", (int id, ProjectUpdateRequest request) =>
{
    var project = data.Projects.SingleOrDefault(p => p.Id == id);
    if (project is null)
        return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(request.Name))
        project.Name = request.Name.Trim();

    if (request.Description is not null)
        project.Description = request.Description.Trim();

    if (!string.IsNullOrWhiteSpace(request.Status))
    {
        if (Enum.TryParse<ProjectStatus>(request.Status, out var status))
            project.Status = status;
        else
            return Results.BadRequest($"Invalid status. Allowed values: {string.Join(", ", Enum.GetNames(typeof(ProjectStatus)))}");
    }

    return Results.Ok(project);
});

// ===== SUBPROJECT ENDPOINTS =====
app.MapGet("/projects/{projectId:int}/subprojects", (int projectId) =>
{
    var project = data.Projects.SingleOrDefault(p => p.Id == projectId);
    if (project is null)
        return Results.NotFound();

    return Results.Ok(project.SubProjects);
});

app.MapGet("/subprojects/{id:int}", (int id) =>
{
    var subproject = data.AllSubProjects.SingleOrDefault(sp => sp.Id == id);
    return subproject is not null ? Results.Ok(subproject) : Results.NotFound();
});

app.MapPost("/projects/{projectId:int}/subprojects", (int projectId, SubProjectRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest("SubProject name is required.");

    var project = data.Projects.SingleOrDefault(p => p.Id == projectId);
    if (project is null)
        return Results.BadRequest("Project does not exist.");

    var subproject = new SubProject
    {
        Id = data.NextSubProjectId++,
        Name = request.Name.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        ProjectId = projectId,
        Status = ProjectStatus.New,
        Tasks = new()
    };

    project.SubProjects.Add(subproject);
    return Results.Created($"/subprojects/{subproject.Id}", subproject);
});

app.MapPut("/subprojects/{id:int}", (int id, SubProjectUpdateRequest request) =>
{
    var subproject = data.AllSubProjects.SingleOrDefault(sp => sp.Id == id);
    if (subproject is null)
        return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(request.Name))
        subproject.Name = request.Name.Trim();

    if (request.Description is not null)
        subproject.Description = request.Description.Trim();

    if (!string.IsNullOrWhiteSpace(request.Status))
    {
        if (Enum.TryParse<ProjectStatus>(request.Status, out var status))
            subproject.Status = status;
        else
            return Results.BadRequest($"Invalid status. Allowed values: {string.Join(", ", Enum.GetNames(typeof(ProjectStatus)))}");
    }

    return Results.Ok(subproject);
});

// ===== TASK ENDPOINTS =====
app.MapGet("/subprojects/{subprojectId:int}/tasks", (int subprojectId) =>
{
    var subproject = data.AllSubProjects.SingleOrDefault(sp => sp.Id == subprojectId);
    if (subproject is null)
        return Results.NotFound();

    return Results.Ok(subproject.Tasks);
});

app.MapGet("/tasks/{id:int}", (int id) =>
{
    var task = data.AllTasks.SingleOrDefault(t => t.Id == id);
    return task is not null ? Results.Ok(task) : Results.NotFound();
});

app.MapPost("/subprojects/{subprojectId:int}/tasks", (int subprojectId, TaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.BadRequest("Task title is required.");

    var subproject = data.AllSubProjects.SingleOrDefault(sp => sp.Id == subprojectId);
    if (subproject is null)
        return Results.BadRequest("SubProject does not exist.");

    if (request.AssigneeId.HasValue && !data.Users.Any(u => u.Id == request.AssigneeId.Value))
        return Results.BadRequest("Assignee does not exist.");

    var task = new TaskItem
    {
        Id = data.NextTaskId++,
        Title = request.Title.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        SubProjectId = subprojectId,
        AssigneeId = request.AssigneeId,
        Status = ProjectStatus.New
    };

    subproject.Tasks.Add(task);
    return Results.Created($"/tasks/{task.Id}", task);
});

app.MapPut("/tasks/{id:int}", (int id, TaskUpdateRequest request) =>
{
    var task = data.AllTasks.SingleOrDefault(t => t.Id == id);
    if (task is null)
        return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(request.Title))
        task.Title = request.Title.Trim();

    if (request.Description is not null)
        task.Description = request.Description.Trim();

    if (!string.IsNullOrWhiteSpace(request.Status))
    {
        if (Enum.TryParse<ProjectStatus>(request.Status, out var status))
            task.Status = status;
        else
            return Results.BadRequest($"Invalid status. Allowed values: {string.Join(", ", Enum.GetNames(typeof(ProjectStatus)))}");
    }

    if (request.AssigneeId.HasValue)
    {
        if (!data.Users.Any(u => u.Id == request.AssigneeId.Value))
            return Results.BadRequest("Assignee does not exist.");

        task.AssigneeId = request.AssigneeId;
    }

    return Results.Ok(task);
});

app.MapGet("/health", () => Results.Ok(new { Status = "Online" }));

app.Run("http://localhost:5001");
