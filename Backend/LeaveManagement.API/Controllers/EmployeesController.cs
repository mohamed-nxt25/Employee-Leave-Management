using System.Security.Claims;
using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    EmployeeHelper employeeHelper = new EmployeeHelper();

    // GET: api/Employees
    [HttpGet]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult GetAll()
    {
        var response = employeeHelper.getAllEmployees();
        return Ok(response);
    }

    // GET: api/Employees/me
    [HttpGet("me")]
    [Authorize(Policy = AppConstants.AllRoles)]
    public IActionResult GetMe()
    {
        string? claimValue = User.FindFirstValue(AppConstants.EmployeeIdClaim);
        if (!int.TryParse(claimValue, out int employeeId) || employeeId <= 0)
        {
            return Ok(new Response
            {
                success = false,
                message = "Your account is not linked to an employee record."
            });
        }

        var response = employeeHelper.getEmployeeById(employeeId);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // GET: api/Employees/{id}
    [HttpGet("{id}")]
    [Authorize(Policy = AppConstants.AllRoles)]
    public IActionResult GetById(int id)
    {
        if (User.IsInRole(AppConstants.Employee) && !CanAccessEmployee(id))
        {
            return Forbid();
        }

        var response = employeeHelper.getEmployeeById(id);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // POST: api/Employees
    [HttpPost]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult CreateEmployee(EmployeeDto employee)
    {
        var response = employeeHelper.createEmployee(employee);
        return Ok(response);
    }

    // PUT: api/Employees/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult UpdateEmployee(int id, EmployeeDto employee)
    {
        var response = employeeHelper.updateEmployee(id, employee);
        return Ok(response);
    }

    // DELETE: api/Employees/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult DeleteEmployee(int id)
    {
        var response = employeeHelper.deleteEmployee(id);
        return Ok(response);
    }

    private bool CanAccessEmployee(int employeeId)
    {
        string? claimValue = User.FindFirstValue(AppConstants.EmployeeIdClaim);
        return int.TryParse(claimValue, out int linkedEmployeeId) && linkedEmployeeId == employeeId;
    }
}
