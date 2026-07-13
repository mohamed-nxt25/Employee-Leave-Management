using LeaveManagement.API.DTOs;

namespace LeaveManagement.API.Models;

public class Department
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string? Description { get; set; }

    public DepartmentDto ToDto()
    {
        return new DepartmentDto
        {
            DepartmentId = DepartmentId,
            DepartmentName = DepartmentName,
            Description = Description
        };
    }

    public static Department FromDto(DepartmentDto dto)
    {
        return new Department
        {
            DepartmentId = dto.DepartmentId,
            DepartmentName = dto.DepartmentName,
            Description = dto.Description
        };
    }
}
