using BoardApp.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(80);
});

builder.Services
    .AddApiDefaults()
    .AddBoardAppDatabase(builder.Configuration)
    .AddBoardAppServices();

var app = builder.Build();

app.UseCors();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapBoardAppEndpoints();

app.Run("http://localhost:5001");
