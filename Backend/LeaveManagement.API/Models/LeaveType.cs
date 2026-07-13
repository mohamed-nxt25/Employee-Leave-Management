using LeaveManagement.API.DTOs;

namespace LeaveManagement.API.Models;

public class LeaveType
{
    public int LeaveTypeId { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int MaxDaysPerYear { get; set; }
    public bool IsPaid { get; set; } = true;

    public LeaveTypeDto ToDto()
    {
        return new LeaveTypeDto
        {
            LeaveTypeId = LeaveTypeId,
            TypeName = TypeName,
            Description = Description,
            MaxDaysPerYear = MaxDaysPerYear,
            IsPaid = IsPaid
        };
    }

    public static LeaveType FromDto(LeaveTypeDto dto)
    {
        return new LeaveType
        {
            LeaveTypeId = dto.LeaveTypeId,
            TypeName = dto.TypeName,
            Description = dto.Description,
            MaxDaysPerYear = dto.MaxDaysPerYear,
            IsPaid = dto.IsPaid
        };
    }
}
