namespace LeaveManagement.API.Data;

public static class Database
{
    public static string ConnectionString { get; private set; } = "";

    public static bool IsProduction { get; private set; }

    public static bool AllowHeaderAuth { get; private set; }

    public static void Configure(IConfiguration configuration, IWebHostEnvironment environment)
    {
        ConnectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");

        IsProduction = environment.IsProduction();
        AllowHeaderAuth = environment.IsDevelopment();
    }

    public static string SafeMessage(Exception ex) =>
        IsProduction ? "A database error occurred. Please try again." : ex.Message;
}
