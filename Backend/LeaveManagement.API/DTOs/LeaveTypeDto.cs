using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.API.DTOs;

public class LeaveTypeDto
{
    public int LeaveTypeId { get; set; }

    [Required(ErrorMessage = "Leave type name is required.")]
    public string TypeName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(1, 365, ErrorMessage = "Max days must be between 1 and 365.")]
    public int MaxDaysPerYear { get; set; }

    public bool IsPaid { get; set; } = true;
}
