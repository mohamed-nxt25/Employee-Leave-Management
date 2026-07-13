using System.ComponentModel.DataAnnotations;

namespace LeaveManagement.API.DTOs;

public class LeaveRequestDto
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Start date is required.")]
    public DateTime StartDate { get; set; }

    [Required(ErrorMessage = "End date is required.")]
    public DateTime EndDate { get; set; }

    [Range(1, 365, ErrorMessage = "Total days must be between 1 and 365.")]
    public int TotalDays { get; set; }

    [Required(ErrorMessage = "Reason is required.")]
    public string Reason { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";
    public DateTime? RequestedAt { get; set; }
    public int? ReviewedByUserId { get; set; }
    public DateTime? ReviewedAt { get; set; }
}
