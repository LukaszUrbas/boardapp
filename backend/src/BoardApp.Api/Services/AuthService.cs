using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BoardApp.Api.Data;
using BoardApp.Api.DTOs.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace BoardApp.Api.Services;

public class AuthService(AppDbContext db, IConfiguration configuration)
{
    public async Task<IResult> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return Results.BadRequest("Username and password are required.");

        var username = request.Username.Trim();
        var user = await db.Users.SingleOrDefaultAsync(u => u.Username == username);
        if (user is null)
            return Results.Unauthorized();

        var providedHash = ComputeSha256(request.Password);
        if (!string.Equals(providedHash, user.PasswordHash, StringComparison.OrdinalIgnoreCase))
            return Results.Unauthorized();

        var jwtKey = Environment.GetEnvironmentVariable("BOARDAPP_JWT_KEY")
            ?? configuration["Auth:JwtKey"];
        if (string.IsNullOrWhiteSpace(jwtKey))
            throw new InvalidOperationException("Auth:JwtKey is missing.");

        var token = CreateToken(user.Id, user.Username, jwtKey);
        return Results.Ok(new LoginResponse(token, user.Name));
    }

    private static string ComputeSha256(string input)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    private static string CreateToken(int userId, string username, string jwtKey)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(ClaimTypes.Name, username),
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.UtcNow.AddHours(12);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
