namespace LeaveManagement.API.Constants;

public static class AppConstants
{
    public const string Admin = "Admin";
    public const string HR = "HR";
    public const string Employee = "Employee";

    public const string AdminOnly = "AdminOnly";
    public const string AdminOrHR = "AdminOrHR";
    public const string AllRoles = "AllRoles";

    public const string SessionCookieName = "elm_user_id";
    public const string EmployeeIdClaim = "employee_id";
}
