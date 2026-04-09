namespace BoardApp.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public int SubProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; } = ProjectStatus.New;
    public int? AssigneeId { get; set; }
}
