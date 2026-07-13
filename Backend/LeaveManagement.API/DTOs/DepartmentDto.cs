using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.API.DTOs;

public class DepartmentDto
{
    public int DepartmentId { get; set; }

    [Required(ErrorMessage = "Department name is required.")]
    public string DepartmentName { get; set; } = string.Empty;

    public string? Description { get; set; }
}
