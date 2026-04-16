using BoardApp.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace BoardApp.Api.Services;

public class UserService(AppDbContext db)
{
    public async Task<IResult> GetAllAsync()
    {
        var users = await db.Users
            .OrderBy(u => u.Id)
            .Select(u => new
            {
                u.Id,
                u.Name,
                u.Username,
            })
            .ToListAsync();

        return Results.Ok(users);
    }
}