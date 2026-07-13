using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = AppConstants.AdminOrHR)]
public class DepartmentsController : ControllerBase
{
    DepartmentHelper departmentHelper = new DepartmentHelper();

    // GET: api/Departments
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = departmentHelper.getAllDepartments();
        return Ok(response);
    }

    // GET: api/Departments/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = departmentHelper.getDepartmentById(id);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // POST: api/Departments
    [HttpPost]
    public IActionResult CreateDepartment(DepartmentDto department)
    {
        var response = departmentHelper.createDepartment(department);
        return Ok(response);
    }

    // PUT: api/Departments/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateDepartment(int id, DepartmentDto department)
    {
        var response = departmentHelper.updateDepartment(id, department);
        return Ok(response);
    }

    // DELETE: api/Departments/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteDepartment(int id)
    {
        var response = departmentHelper.deleteDepartment(id);
        return Ok(response);
    }
}
