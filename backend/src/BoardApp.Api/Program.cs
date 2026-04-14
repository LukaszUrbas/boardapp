using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using BoardApp.Api.Data;
using BoardApp.Api.Models;
using BoardApp.Api.DTOs.Projects;
using BoardApp.Api.DTOs.SubProjects;
using BoardApp.Api.DTOs.Tasks;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80);
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.PropertyNamingPolicy = null;
});

var connectionString = builder.Configuration.GetConnectionString("BoardApp");
if (string.IsNullOrWhiteSpace(connectionString))
    throw new InvalidOperationException("Connection string 'BoardApp' is missing.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

app.UseCors();
app.UseRouting();

// ===== USER ENDPOINTS =====
app.MapGet("/users", async (AppDbContext db) =>
{
    var users = await db.Users.OrderBy(u => u.Id).ToListAsync();
    return Results.Ok(users);
});

// ===== PROJECT ENDPOINTS =====
app.MapGet("/projects", async (AppDbContext db) =>
{
    var projects = await db.Projects
        .Include(p => p.SubProjects)
        .ThenInclude(sp => sp.Tasks)
        .OrderBy(p => p.Id)
        .ToListAsync();

    return Results.Ok(projects);
});

app.MapGet("/projects/{id:int}", async (int id, AppDbContext db) =>
{
    var project = await db.Projects
        .Include(p => p.SubProjects)
        .ThenInclude(sp => sp.Tasks)
        .SingleOrDefaultAsync(p => p.Id == id);

    return project is not null ? Results.Ok(project) : Results.NotFound();
});

app.MapPost("/projects", async (ProjectRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest("Project name is required.");

    var project = new Project
    {
        Name = request.Name.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        Status = ProjectStatus.New,
        SubProjects = new()
    };

    db.Projects.Add(project);
    await db.SaveChangesAsync();
    return Results.Created($"/projects/{project.Id}", project);
});

app.MapPut("/projects/{id:int}", async (int id, ProjectUpdateRequest request, AppDbContext db) =>
{
    var project = await db.Projects.SingleOrDefaultAsync(p => p.Id == id);
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

    await db.SaveChangesAsync();
    return Results.Ok(project);
});

// ===== SUBPROJECT ENDPOINTS =====
app.MapGet("/projects/{projectId:int}/subprojects", async (int projectId, AppDbContext db) =>
{
    var projectExists = await db.Projects.AnyAsync(p => p.Id == projectId);
    if (!projectExists)
        return Results.NotFound();

    var subProjects = await db.SubProjects
        .Include(sp => sp.Tasks)
        .Where(sp => sp.ProjectId == projectId)
        .OrderBy(sp => sp.Id)
        .ToListAsync();

    return Results.Ok(subProjects);
});

app.MapGet("/subprojects/{id:int}", async (int id, AppDbContext db) =>
{
    var subproject = await db.SubProjects
        .Include(sp => sp.Tasks)
        .SingleOrDefaultAsync(sp => sp.Id == id);

    return subproject is not null ? Results.Ok(subproject) : Results.NotFound();
});

app.MapPost("/projects/{projectId:int}/subprojects", async (int projectId, SubProjectRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
        return Results.BadRequest("SubProject name is required.");

    var projectExists = await db.Projects.AnyAsync(p => p.Id == projectId);
    if (!projectExists)
        return Results.BadRequest("Project does not exist.");

    var subproject = new SubProject
    {
        Name = request.Name.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        ProjectId = projectId,
        Status = ProjectStatus.New,
        Tasks = new()
    };

    db.SubProjects.Add(subproject);
    await db.SaveChangesAsync();
    return Results.Created($"/subprojects/{subproject.Id}", subproject);
});

app.MapPut("/subprojects/{id:int}", async (int id, SubProjectUpdateRequest request, AppDbContext db) =>
{
    var subproject = await db.SubProjects.SingleOrDefaultAsync(sp => sp.Id == id);
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

    await db.SaveChangesAsync();
    return Results.Ok(subproject);
});

// ===== TASK ENDPOINTS =====
app.MapGet("/subprojects/{subprojectId:int}/tasks", async (int subprojectId, AppDbContext db) =>
{
    var subProjectExists = await db.SubProjects.AnyAsync(sp => sp.Id == subprojectId);
    if (!subProjectExists)
        return Results.NotFound();

    var tasks = await db.Tasks
        .Where(t => t.SubProjectId == subprojectId)
        .OrderBy(t => t.Id)
        .ToListAsync();

    return Results.Ok(tasks);
});

app.MapGet("/tasks/{id:int}", async (int id, AppDbContext db) =>
{
    var task = await db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
    return task is not null ? Results.Ok(task) : Results.NotFound();
});

app.MapPost("/subprojects/{subprojectId:int}/tasks", async (int subprojectId, TaskRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.BadRequest("Task title is required.");

    var subProjectExists = await db.SubProjects.AnyAsync(sp => sp.Id == subprojectId);
    if (!subProjectExists)
        return Results.BadRequest("SubProject does not exist.");

    if (request.AssigneeId.HasValue && !await db.Users.AnyAsync(u => u.Id == request.AssigneeId.Value))
        return Results.BadRequest("Assignee does not exist.");

    var task = new TaskItem
    {
        Title = request.Title.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        SubProjectId = subprojectId,
        AssigneeId = request.AssigneeId,
        Status = ProjectStatus.New
    };

    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    return Results.Created($"/tasks/{task.Id}", task);
});

app.MapPut("/tasks/{id:int}", async (int id, TaskUpdateRequest request, AppDbContext db) =>
{
    var task = await db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
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
        if (!await db.Users.AnyAsync(u => u.Id == request.AssigneeId.Value))
            return Results.BadRequest("Assignee does not exist.");

        task.AssigneeId = request.AssigneeId;
    }

    await db.SaveChangesAsync();
    return Results.Ok(task);
});

app.MapGet("/health", async (AppDbContext db) =>
{
    var canConnect = await db.Database.CanConnectAsync();
    return canConnect
        ? Results.Ok(new { Status = "Online", Database = "Connected" })
        : Results.Problem("Database connection failed.", statusCode: StatusCodes.Status503ServiceUnavailable);
});

app.Run("http://localhost:5001");
