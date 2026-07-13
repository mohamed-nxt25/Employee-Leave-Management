using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.API.DTOs;

public class EmployeeDto
{
    public int EmployeeId { get; set; }
    public int UserId { get; set; }
    public int DepartmentId { get; set; }

    [Required(ErrorMessage = "Employee code is required.")]
    public string EmployeeCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "First name is required.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required.")]
    public string LastName { get; set; } = string.Empty;

    public string? Phone { get; set; }

    [Required(ErrorMessage = "Hire date is required.")]
    public DateTime HireDate { get; set; }

    [Required(ErrorMessage = "Job title is required.")]
    public string JobTitle { get; set; } = string.Empty;

    public string DepartmentName { get; set; } = string.Empty;
}
