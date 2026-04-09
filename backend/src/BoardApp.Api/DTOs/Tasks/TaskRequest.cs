namespace BoardApp.Api.DTOs.Tasks;

public record TaskRequest(string Title, string? Description, int? AssigneeId);
