namespace BoardApp.Api.DTOs.Tasks;

public record TaskUpdateRequest(string? Title, string? Description, int? AssigneeId, string? Status);
