using LeaveManagement.API.DTOs;

namespace LeaveManagement.API.Models;

public class LeaveRequest
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TotalDays { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime? RequestedAt { get; set; }
    public int? ReviewedByUserId { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string LeaveTypeName { get; set; } = string.Empty;

    public LeaveRequestDto ToDto()
    {
        return new LeaveRequestDto
        {
            LeaveRequestId = LeaveRequestId,
            EmployeeId = EmployeeId,
            EmployeeName = EmployeeName,
            LeaveTypeId = LeaveTypeId,
            LeaveTypeName = LeaveTypeName,
            StartDate = StartDate,
            EndDate = EndDate,
            TotalDays = TotalDays,
            Reason = Reason,
            Status = Status,
            RequestedAt = RequestedAt,
            ReviewedByUserId = ReviewedByUserId,
            ReviewedAt = ReviewedAt
        };
    }

    public static LeaveRequest FromDto(LeaveRequestDto dto)
    {
        return new LeaveRequest
        {
            LeaveRequestId = dto.LeaveRequestId,
            EmployeeId = dto.EmployeeId,
            EmployeeName = dto.EmployeeName,
            LeaveTypeId = dto.LeaveTypeId,
            LeaveTypeName = dto.LeaveTypeName,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            TotalDays = dto.TotalDays,
            Reason = dto.Reason,
            Status = dto.Status,
            RequestedAt = dto.RequestedAt,
            ReviewedByUserId = dto.ReviewedByUserId,
            ReviewedAt = dto.ReviewedAt
        };
    }
}
