using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Policy = AppConstants.AdminOnly)]
public class UsersController : ControllerBase
{
    UserHelper userHelper = new UserHelper();

    // GET: api/Users
    [HttpGet]
    public IActionResult GetAll()
    {
        var response = userHelper.getAllUsers();
        return Ok(response);
    }

    // GET: api/Users/{id}
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var response = userHelper.getUserById(id);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // POST: api/Users
    [HttpPost]
    public IActionResult CreateUser(UserDto user)
    {
        var response = userHelper.createUser(user);
        return Ok(response);
    }

    // PUT: api/Users/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateUser(int id, UserDto user)
    {
        var response = userHelper.updateUser(id, user);
        return Ok(response);
    }

    // DELETE: api/Users/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(int id)
    {
        var response = userHelper.deleteUser(id);
        return Ok(response);
    }
}
