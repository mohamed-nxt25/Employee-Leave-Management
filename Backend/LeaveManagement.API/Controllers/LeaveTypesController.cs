using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class LeaveTypesController : ControllerBase
{
    LeaveTypeHelper leaveTypeHelper = new LeaveTypeHelper();

    // GET: api/LeaveTypes
    [HttpGet]
    [Authorize(Policy = AppConstants.AllRoles)]
    public IActionResult GetAll()
    {
        var response = leaveTypeHelper.getAllLeaveTypes();
        return Ok(response);
    }

    // GET: api/LeaveTypes/{id}
    [HttpGet("{id}")]
    [Authorize(Policy = AppConstants.AllRoles)]
    public IActionResult GetById(int id)
    {
        var response = leaveTypeHelper.getLeaveTypeById(id);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // POST: api/LeaveTypes
    [HttpPost]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult CreateLeaveType(LeaveTypeDto leaveType)
    {
        var response = leaveTypeHelper.createLeaveType(leaveType);
        return Ok(response);
    }

    // PUT: api/LeaveTypes/{id}
    [HttpPut("{id}")]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult UpdateLeaveType(int id, LeaveTypeDto leaveType)
    {
        var response = leaveTypeHelper.updateLeaveType(id, leaveType);
        return Ok(response);
    }

    // DELETE: api/LeaveTypes/{id}
    [HttpDelete("{id}")]
    [Authorize(Policy = AppConstants.AdminOrHR)]
    public IActionResult DeleteLeaveType(int id)
    {
        var response = leaveTypeHelper.deleteLeaveType(id);
        return Ok(response);
    }
}
