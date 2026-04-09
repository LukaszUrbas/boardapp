namespace BoardApp.Api.Models;

public class SubProject
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public ProjectStatus Status { get; set; } = ProjectStatus.New;
    public List<TaskItem> Tasks { get; set; } = new();
}
