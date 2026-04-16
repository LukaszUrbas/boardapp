using BoardApp.Api.Data;
using BoardApp.Api.Services;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;

namespace BoardApp.Api.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApiDefaults(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(policy =>
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
        });

        services.Configure<JsonOptions>(options =>
        {
            options.SerializerOptions.PropertyNamingPolicy = null;
        });

        return services;
    }

    public static IServiceCollection AddBoardAppDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("BoardApp");
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException("Connection string 'BoardApp' is missing.");

        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        return services;
    }

    public static IServiceCollection AddBoardAppServices(this IServiceCollection services)
    {
        services.AddScoped<UserService>();
        services.AddScoped<ProjectService>();
        services.AddScoped<SubProjectService>();
        services.AddScoped<TaskService>();
        services.AddScoped<HealthService>();

        return services;
    }
}