
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AngularApp");

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint(
        "/swagger/v1/swagger.json",
        "EnterpriseServiceDesk.Api v1");

    options.ConfigObject.ValidatorUrl = null;
});


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    await db.Database.EnsureCreatedAsync();
}

app.MapGet("/api/requests", async (AppDbContext db) =>
    Results.Ok(await db.ServiceRequests
        .OrderByDescending(r => r.CreatedAt)
        .ToListAsync()));

app.MapGet("/api/requests/{id:int}", async Task<IResult> (
    int id, AppDbContext db) =>
{
    var request = await db.ServiceRequests.FindAsync(id);

    return request is null
        ? Results.NotFound()
        : Results.Ok(request);
});

app.MapPost("/api/requests", async Task<IResult> (
    ServiceRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Title) ||
        string.IsNullOrWhiteSpace(request.Description))
    {
        return Results.BadRequest(new
        {
            message = "Title and description are required."
        });
    }

    if (request.Title.Length > 150 ||
        request.Description.Length > 2000)
    {
        return Results.BadRequest(new
        {
            message = "Title must be at most 150 characters and description at most 2000."
        });
    }

    request.Id = 0;
    request.Title = request.Title.Trim();
    request.Description = request.Description.Trim();
    request.Priority = "Medium";
    request.Status = "Open";
    request.CreatedAt = DateTime.UtcNow;

    db.ServiceRequests.Add(request);
    await db.SaveChangesAsync();

    return Results.Created($"/api/requests/{request.Id}", request);
});

app.MapPut("/api/requests/{id:int}", async Task<IResult> (
    int id, ServiceRequest input, AppDbContext db) =>
{
    var request = await db.ServiceRequests.FindAsync(id);

    if (request is null)
        return Results.NotFound();

    if (string.IsNullOrWhiteSpace(input.Title) ||
        string.IsNullOrWhiteSpace(input.Description))
    {
        return Results.BadRequest(new
        {
            message = "Title and description are required."
        });
    }

    if (input.Title.Length > 150 ||
        input.Description.Length > 2000)
    {
        return Results.BadRequest(new
        {
            message = "Title or description is too long."
        });
    }

    if (!new[] { "Low", "Medium", "High" }.Contains(input.Priority) ||
        !new[] { "Open", "In Progress", "Closed" }.Contains(input.Status))
    {
        return Results.BadRequest(new
        {
            message = "Invalid priority or status."
        });
    }

    request.Title = input.Title.Trim();
    request.Description = input.Description.Trim();
    request.Priority = input.Priority;
    request.Status = input.Status;

    await db.SaveChangesAsync();

    return Results.Ok(request);
});

app.MapDelete("/api/requests/{id:int}", async Task<IResult> (
    int id, AppDbContext db) =>
{
    var request = await db.ServiceRequests.FindAsync(id);

    if (request is null)
        return Results.NotFound();

    db.ServiceRequests.Remove(request);
    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.Run();

public partial class Program { }

public class ServiceRequest
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Open";
    public DateTime CreatedAt { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : DbContext(options)
{
    public DbSet<ServiceRequest> ServiceRequests => Set<ServiceRequest>();
}