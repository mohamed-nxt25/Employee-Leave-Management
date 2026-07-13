using System.Security.Claims;
using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LeaveManagement.API.Controllers;

[Route("api")]
[ApiController]
public class AuthController : ControllerBase
{
    AuthHelper authHelper = new AuthHelper();

    // POST: api/login
    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login(LoginRequest request)
    {
        var response = authHelper.login(request);

        if (response.success && response.data is LoginResult loginResult)
        {
            Response.Cookies.Append(
                AppConstants.SessionCookieName,
                loginResult.UserId.ToString(),
                AuthHelper.CreateSessionCookieOptions());
        }

        return Ok(response);
    }

    // GET: api/me
    [HttpGet("me")]
    [Authorize(Policy = AppConstants.AllRoles)]
    public IActionResult GetCurrentUser()
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var response = authHelper.getCurrentUser(userId);

        if (!response.success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    // POST: api/logout
    [HttpPost("logout")]
    [AllowAnonymous]
    public IActionResult Logout()
    {
        Response.Cookies.Delete(AppConstants.SessionCookieName, AuthHelper.CreateSessionCookieOptions());
        return Ok(new Response { success = true, message = "Logged out successfully." });
    }

    // POST: api/change-password
    [HttpPost("change-password")]
    [Authorize(Policy = AppConstants.AllRoles)]
    public IActionResult ChangePassword(ChangePasswordRequest request)
    {
        int userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        string username = User.FindFirstValue(ClaimTypes.Name)!;

        var response = authHelper.changePassword(userId, username, request);
        return Ok(response);
    }
}
