using BoardApp.Api.Data;
using Microsoft.AspNetCore.Http;

namespace BoardApp.Api.Services;

public class HealthService(AppDbContext db)
{
    public async Task<IResult> GetHealthAsync()
    {
        var canConnect = await db.Database.CanConnectAsync();
        return canConnect
            ? Results.Ok(new { Status = "Online", Database = "Connected" })
            : Results.Problem("Database connection failed.", statusCode: StatusCodes.Status503ServiceUnavailable);
    }
}