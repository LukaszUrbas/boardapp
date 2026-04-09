namespace BoardApp.Api.Data;

using BoardApp.Api.Models;

public class InMemoryStore
{
    public List<User> Users { get; } = new()
    {
        new() { Id = 1, Name = "Alice" },
        new() { Id = 2, Name = "Bob" },
        new() { Id = 3, Name = "Claire" }
    };

    public List<Project> Projects { get; } = new();

    public List<SubProject> AllSubProjects =>
        Projects.SelectMany(p => p.SubProjects).ToList();

    public List<TaskItem> AllTasks =>
        AllSubProjects.SelectMany(sp => sp.Tasks).ToList();

    public int NextProjectId { get; set; } = 1;
    public int NextSubProjectId { get; set; } = 1;
    public int NextTaskId { get; set; } = 1;

    public InMemoryStore()
    {
        // Initialize with sample data
        var project1 = new Project
        {
            Id = NextProjectId++,
            Name = "Website Redesign",
            Description = "Refresh the homepage and update branding.",
            Status = ProjectStatus.InProgress,
            SubProjects = new()
            {
                new SubProject
                {
                    Id = NextSubProjectId++,
                    ProjectId = 1,
                    Name = "Frontend Redesign",
                    Description = "Update UI components and styles",
                    Status = ProjectStatus.InProgress,
                    Tasks = new()
                    {
                        new TaskItem
                        {
                            Id = NextTaskId++,
                            SubProjectId = 1,
                            Title = "Design hero section",
                            Description = "Create wireframes and mockups.",
                            Status = ProjectStatus.InProgress,
                            AssigneeId = 1
                        }
                    }
                },
                new SubProject
                {
                    Id = NextSubProjectId++,
                    ProjectId = 1,
                    Name = "Backend Updates",
                    Description = "Update APIs and database schema",
                    Status = ProjectStatus.New,
                    Tasks = new()
                }
            }
        };

        var project2 = new Project
        {
            Id = NextProjectId++,
            Name = "Product Launch",
            Description = "Coordinate launch campaign.",
            Status = ProjectStatus.New,
            SubProjects = new()
            {
                new SubProject
                {
                    Id = NextSubProjectId++,
                    ProjectId = 2,
                    Name = "Marketing Campaign",
                    Description = "Plan and execute marketing activities",
                    Status = ProjectStatus.New,
                    Tasks = new()
                    {
                        new TaskItem
                        {
                            Id = NextTaskId++,
                            SubProjectId = 3,
                            Title = "Write launch email",
                            Description = "Draft copy for the kickoff email.",
                            Status = ProjectStatus.New,
                            AssigneeId = 2
                        }
                    }
                }
            }
        };

        Projects.Add(project1);
        Projects.Add(project2);
    }
}
