using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Json;

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

app.MapGet("/users", () => Results.Ok(data.Users));
app.MapGet("/projects", () => Results.Ok(data.Projects));
app.MapGet("/tasks", () => Results.Ok(data.Tasks));
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
        Description = request.Description?.Trim() ?? string.Empty
    };

    data.Projects.Add(project);
    return Results.Created($"/projects/{project.Id}", project);
});

app.MapPost("/tasks", (TaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Title))
        return Results.BadRequest("Task title is required.");

    if (!data.Projects.Any(p => p.Id == request.ProjectId))
        return Results.BadRequest("Project does not exist.");

    if (request.AssigneeId.HasValue && !data.Users.Any(u => u.Id == request.AssigneeId.Value))
        return Results.BadRequest("Assignee does not exist.");

    var task = new TaskItem
    {
        Id = data.NextTaskId++,
        Title = request.Title.Trim(),
        Description = request.Description?.Trim() ?? string.Empty,
        ProjectId = request.ProjectId,
        AssigneeId = request.AssigneeId,
        Status = string.IsNullOrWhiteSpace(request.Status) ? "Todo" : request.Status.Trim()
    };

    data.Tasks.Add(task);
    return Results.Created($"/tasks/{task.Id}", task);
});

app.MapPut("/tasks/{id:int}", (int id, TaskUpdateRequest request) =>
{
    var task = data.Tasks.SingleOrDefault(t => t.Id == id);
    if (task is null)
        return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(request.Title))
        task.Title = request.Title.Trim();

    if (request.Description is not null)
        task.Description = request.Description.Trim();

    if (!string.IsNullOrWhiteSpace(request.Status))
        task.Status = request.Status.Trim();

    if (request.AssigneeId.HasValue)
    {
        if (!data.Users.Any(u => u.Id == request.AssigneeId.Value))
            return Results.BadRequest("Assignee does not exist.");

        task.AssigneeId = request.AssigneeId;
    }

    return Results.Ok(task);
});

app.MapGet("/projects/{id:int}/tasks", (int id) =>
{
    var tasks = data.Tasks.Where(t => t.ProjectId == id).ToList();
    return Results.Ok(tasks);
});

app.MapGet("/health", () => Results.Ok(new { Status = "Online" }));

app.Run("http://localhost:5001");

internal class InMemoryStore
{
    public List<User> Users { get; } = new()
    {
        new() { Id = 1, Name = "Alice" },
        new() { Id = 2, Name = "Bob" },
        new() { Id = 3, Name = "Claire" }
    };

    public List<Project> Projects { get; } = new()
    {
        new() { Id = 1, Name = "Website Redesign", Description = "Refresh the homepage and update branding." },
        new() { Id = 2, Name = "Product Launch", Description = "Coordinate launch campaign." }
    };

    public List<TaskItem> Tasks { get; } = new()
    {
        new() { Id = 1, Title = "Design hero section", Description = "Create wireframes and mockups.", ProjectId = 1, AssigneeId = 1, Status = "Todo" },
        new() { Id = 2, Title = "Write launch email", Description = "Draft copy for the kickoff email.", ProjectId = 2, AssigneeId = 2, Status = "Todo" }
    };

    public int NextProjectId { get; set; } = 3;
    public int NextTaskId { get; set; } = 3;
}

internal class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

internal class Project
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

internal class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int ProjectId { get; set; }
    public int? AssigneeId { get; set; }
    public string Status { get; set; } = "Todo";
}

internal record ProjectRequest(string Name, string? Description);
internal record TaskRequest(string Title, string? Description, int ProjectId, int? AssigneeId, string? Status);
internal record TaskUpdateRequest(string? Title, string? Description, int? AssigneeId, string? Status);
