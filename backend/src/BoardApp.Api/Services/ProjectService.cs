using BoardApp.Api.Data;
using BoardApp.Api.DTOs.Projects;
using BoardApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace BoardApp.Api.Services;

public class ProjectService(AppDbContext db)
{
    public async Task<IResult> GetAllAsync()
    {
        var projects = await db.Projects
            .Include(p => p.SubProjects)
            .ThenInclude(sp => sp.Tasks)
            .OrderBy(p => p.Id)
            .ToListAsync();

        return Results.Ok(projects);
    }

    public async Task<IResult> GetByIdAsync(int id)
    {
        var project = await db.Projects
            .Include(p => p.SubProjects)
            .ThenInclude(sp => sp.Tasks)
            .SingleOrDefaultAsync(p => p.Id == id);

        return project is not null ? Results.Ok(project) : Results.NotFound();
    }

    public async Task<IResult> CreateAsync(ProjectRequest request)
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
    }

    public async Task<IResult> UpdateAsync(int id, ProjectUpdateRequest request)
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
    }

    public async Task<IResult> DeleteAsync(int id)
    {
        var project = await db.Projects.SingleOrDefaultAsync(p => p.Id == id);
        if (project is null)
            return Results.NotFound();

        db.Projects.Remove(project);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
}