using LeaveManagement.API.Auth;
using LeaveManagement.API.Constants;
using LeaveManagement.API.Middleware;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Policy;
using Microsoft.AspNetCore.Mvc;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IAuthorizationMiddlewareResultHandler, JsonAuthorizationMiddlewareResultHandler>();

builder.Services.AddControllers();

builder.Services.AddAuthentication(UserHeaderAuthenticationHandler.SchemeName)
    .AddScheme<AuthenticationSchemeOptions, UserHeaderAuthenticationHandler>(
        UserHeaderAuthenticationHandler.SchemeName, null);

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(AppConstants.AdminOnly, policy => policy.RequireRole(AppConstants.Admin));
    options.AddPolicy(AppConstants.AdminOrHR, policy => policy.RequireRole(AppConstants.Admin, AppConstants.HR));
    options.AddPolicy(AppConstants.AllRoles, policy => policy.RequireRole(AppConstants.Admin, AppConstants.HR, AppConstants.Employee));
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        string message = string.Join(" ", context.ModelState.Values
            .SelectMany(v => v.Errors)
            .Select(e => e.ErrorMessage));

        return new BadRequestObjectResult(new { success = false, message });
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173");
        policy.AllowAnyHeader();
        policy.AllowAnyMethod();
        policy.AllowCredentials();
    });
});

WebApplication app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/api/status", () => Results.Ok(new { status = "Running" })).AllowAnonymous();
app.MapGet("/api", () => Results.Ok(new
{
    name = "Employee Leave Management API",
    status = "GET /api/status",
    login = "POST /api/login  { \"username\": \"admin\", \"password\": \"<your-password>\" }",
    session = "GET /api/me  (uses login cookie or X-User-Id header)",
    postmanTip = "After POST /api/login, Postman stores the cookie automatically. Or add header X-User-Id: 1 for admin.",
})).AllowAnonymous();
app.MapGet("/", () => Results.Redirect("/api/status"));

app.Run();
