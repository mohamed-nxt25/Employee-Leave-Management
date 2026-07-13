using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = AppConstants.AllRoles)]
public class LeaveRequestsController : ControllerBase
{
    LeaveRequestHelper leaveRequestHelper = new LeaveRequestHelper();

    // GET: api/LeaveRequests
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = leaveRequestHelper.getAllLeaveRequests();
        return Ok(response);
    }

    // GET: api/LeaveRequests/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = leaveRequestHelper.getLeaveRequestById(id);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // POST: api/LeaveRequests
    [HttpPost]
    public IActionResult CreateLeaveRequest(LeaveRequestDto leaveRequest)
    {
        var response = leaveRequestHelper.createLeaveRequest(leaveRequest);
        return Ok(response);
    }

    // PUT: api/LeaveRequests/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateLeaveRequest(int id, LeaveRequestDto leaveRequest)
    {
        var response = leaveRequestHelper.updateLeaveRequest(id, leaveRequest);
        return Ok(response);
    }

    // DELETE: api/LeaveRequests/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteLeaveRequest(int id)
    {
        var response = leaveRequestHelper.deleteLeaveRequest(id);
        return Ok(response);
    }
}
