using LeaveManagement.API.DTOs;

namespace LeaveManagement.API.Models;

public class User
{
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public int? EmployeeId { get; set; }

    public UserDto ToDto(bool hidePassword = true)
    {
        return new UserDto
        {
            UserId = UserId,
            Username = Username,
            Email = Email,
            Password = hidePassword ? string.Empty : Password,
            Role = Role,
            IsActive = IsActive,
            EmployeeId = EmployeeId ?? 0
        };
    }

    public static User FromDto(UserDto dto)
    {
        return new User
        {
            UserId = dto.UserId,
            Username = dto.Username,
            Email = dto.Email,
            Password = dto.Password,
            Role = dto.Role,
            IsActive = dto.IsActive,
            EmployeeId = dto.EmployeeId <= 0 ? null : dto.EmployeeId
        };
    }

    public LoginResult ToLoginResult()
    {
        return new LoginResult
        {
            UserId = UserId,
            Username = Username,
            Role = Role,
            EmployeeId = EmployeeId ?? 0
        };
    }
}
