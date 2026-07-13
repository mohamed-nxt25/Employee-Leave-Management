using LeaveManagement.API.DTOs;

namespace LeaveManagement.API.Models;

public class Employee
{
    public int EmployeeId { get; set; }
    public int? UserId { get; set; }
    public int DepartmentId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public DateTime HireDate { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string DepartmentName { get; set; } = string.Empty;

    public EmployeeDto ToDto()
    {
        return new EmployeeDto
        {
            EmployeeId = EmployeeId,
            UserId = UserId ?? 0,
            DepartmentId = DepartmentId,
            EmployeeCode = EmployeeCode,
            FirstName = FirstName,
            LastName = LastName,
            Phone = Phone,
            HireDate = HireDate,
            JobTitle = JobTitle,
            DepartmentName = DepartmentName
        };
    }

    public static Employee FromDto(EmployeeDto dto)
    {
        return new Employee
        {
            EmployeeId = dto.EmployeeId,
            UserId = dto.UserId <= 0 ? null : dto.UserId,
            DepartmentId = dto.DepartmentId,
            EmployeeCode = dto.EmployeeCode,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Phone = dto.Phone,
            HireDate = dto.HireDate,
            JobTitle = dto.JobTitle,
            DepartmentName = dto.DepartmentName
        };
    }
}
