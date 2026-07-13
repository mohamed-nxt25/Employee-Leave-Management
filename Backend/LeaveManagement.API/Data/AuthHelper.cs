using LeaveManagement.API.Constants;
using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;

namespace LeaveManagement.API.Data;

public class AuthHelper
{
    string con_str = "Data Source=MOHAMED;Initial Catalog=LeaveManagement;Integrated Security=True;Trust Server Certificate=True";
    SqlConnection conn;
    SqlCommand cmd;
    SqlDataReader dr;
    string qry;

    public static CookieOptions CreateSessionCookieOptions() => new CookieOptions
    {
        HttpOnly = true,
        Secure = false,
        SameSite = SameSiteMode.Lax,
        MaxAge = TimeSpan.FromHours(8),
        Path = "/",
    };

    public Response getCurrentUser(int userId)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT UserId, Username, Role, EmployeeId FROM Users WHERE UserId = {userId} AND IsActive = 1";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "User not found or inactive." };
            }

            LoginResult data = new LoginResult
            {
                UserId = Convert.ToInt32(dr["UserId"]),
                Username = dr["Username"].ToString() ?? "",
                Role = dr["Role"].ToString() ?? "",
                EmployeeId = dr["EmployeeId"] == DBNull.Value ? 0 : Convert.ToInt32(dr["EmployeeId"])
            };

            conn.Close();

            return new Response
            {
                success = true,
                message = "Session restored",
                data = data
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response login(LoginRequest request)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT UserId, Username, Role, EmployeeId FROM Users WHERE Username = '{request.Username}' AND Password = '{request.Password}' AND IsActive = 1";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "Invalid username or password." };
            }

            LoginResult data = new LoginResult
            {
                UserId = Convert.ToInt32(dr["UserId"]),
                Username = dr["Username"].ToString() ?? "",
                Role = dr["Role"].ToString() ?? "",
                EmployeeId = dr["EmployeeId"] == DBNull.Value ? 0 : Convert.ToInt32(dr["EmployeeId"])
            };

            conn.Close();

            return new Response
            {
                success = true,
                message = "Login successful",
                data = data
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response changePassword(int userId, string username, ChangePasswordRequest request)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT UserId FROM Users WHERE Username = '{username}' AND Password = '{request.CurrentPassword}' AND IsActive = 1";
            cmd = new SqlCommand(qry, conn);
            object? result = cmd.ExecuteScalar();

            if (result == null || Convert.ToInt32(result) != userId)
            {
                conn.Close();
                return new Response { success = false, message = "Current password is incorrect." };
            }

            qry = $"UPDATE Users SET Password = '{request.NewPassword}' WHERE UserId = {userId}";
            cmd = new SqlCommand(qry, conn);
            int rows = cmd.ExecuteNonQuery();
            conn.Close();

            if (rows > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Password has been updated successfully"
                };
            }

            return new Response { success = false, message = "There is database transaction error" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }
}
