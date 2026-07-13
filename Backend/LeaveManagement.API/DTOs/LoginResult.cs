namespace LeaveManagement.API.DTOs;

public class LoginResult
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int EmployeeId { get; set; }
}
