using BoardApp.Api.Data;
using BoardApp.Api.DTOs.SubProjects;
using BoardApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardApp.Api.Services;

public class SubProjectService(AppDbContext db)
{
    public async Task<IResult> GetByProjectIdAsync(int projectId)
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
    }

    public async Task<IResult> GetByIdAsync(int id)
    {
        var subproject = await db.SubProjects
            .Include(sp => sp.Tasks)
            .SingleOrDefaultAsync(sp => sp.Id == id);

        return subproject is not null ? Results.Ok(subproject) : Results.NotFound();
    }

    public async Task<IResult> CreateAsync(int projectId, SubProjectRequest request)
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
    }

    public async Task<IResult> UpdateAsync(int id, SubProjectUpdateRequest request)
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
    }

    public async Task<IResult> DeleteAsync(int id)
    {
        var subproject = await db.SubProjects.SingleOrDefaultAsync(sp => sp.Id == id);
        if (subproject is null)
            return Results.NotFound();

        db.SubProjects.Remove(subproject);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
}