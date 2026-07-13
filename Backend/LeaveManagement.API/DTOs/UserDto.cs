using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.API.DTOs;

public class UserDto
{
    public int UserId { get; set; }

    [Required(ErrorMessage = "Username is required.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email.")]
    public string Email { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    [Required(ErrorMessage = "Role is required.")]
    [RegularExpression("^(Admin|HR|Employee)$", ErrorMessage = "Role must be Admin, HR, or Employee.")]
    public string Role { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;
    public int EmployeeId { get; set; }
}
