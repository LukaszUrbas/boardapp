using BoardApp.Api.Data;
using BoardApp.Api.DTOs.Tasks;
using BoardApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardApp.Api.Services;

public class TaskService(AppDbContext db)
{
    public async Task<IResult> GetBySubProjectIdAsync(int subprojectId)
    {
        var subProjectExists = await db.SubProjects.AnyAsync(sp => sp.Id == subprojectId);
        if (!subProjectExists)
            return Results.NotFound();

        var tasks = await db.Tasks
            .Where(t => t.SubProjectId == subprojectId)
            .OrderBy(t => t.Id)
            .ToListAsync();

        return Results.Ok(tasks);
    }

    public async Task<IResult> GetByIdAsync(int id)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
        return task is not null ? Results.Ok(task) : Results.NotFound();
    }

    public async Task<IResult> CreateAsync(int subprojectId, TaskRequest request)
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
    }

    public async Task<IResult> UpdateAsync(int id, TaskUpdateRequest request)
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
    }

    public async Task<IResult> DeleteAsync(int id)
    {
        var task = await db.Tasks.SingleOrDefaultAsync(t => t.Id == id);
        if (task is null)
            return Results.NotFound();

        db.Tasks.Remove(task);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
}