using System.Security.Claims;
using System.Text.Encodings.Web;
using LeaveManagement.API.Constants;
using LeaveManagement.API.Data;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace LeaveManagement.API.Auth;

public class UserHeaderAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public const string SchemeName = "UserHeader";
    public const string UserIdHeader = "X-User-Id";

    UserHelper userHelper = new UserHelper();

    public UserHeaderAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder)
        : base(options, logger, encoder)
    {
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        int userId = 0;

        if (Request.Headers.TryGetValue(UserIdHeader, out var headerValue)
            && int.TryParse(headerValue.FirstOrDefault(), out int headerUserId)
            && headerUserId > 0)
        {
            userId = headerUserId;
        }
        else if (Request.Cookies.TryGetValue(AppConstants.SessionCookieName, out var cookieValue)
            && int.TryParse(cookieValue, out int cookieUserId)
            && cookieUserId > 0)
        {
            userId = cookieUserId;
        }
        else
        {
            return Task.FromResult(AuthenticateResult.NoResult());
        }

        User? user = userHelper.getUserForAuth(userId);
        if (user == null || !user.IsActive)
        {
            return Task.FromResult(AuthenticateResult.Fail("User not found or inactive."));
        }

        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(AppConstants.EmployeeIdClaim, (user.EmployeeId ?? 0).ToString())
        };

        ClaimsIdentity identity = new ClaimsIdentity(claims, SchemeName);
        AuthenticationTicket ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), SchemeName);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
