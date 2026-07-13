using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.Data.SqlClient;

namespace LeaveManagement.API.Data;

public class UserHelper
{
    string con_str = "Data Source=MOHAMED;Initial Catalog=LeaveManagement;Integrated Security=True;Trust Server Certificate=True";
    SqlConnection conn;
    SqlCommand cmd;
    SqlDataReader dr;
    string qry;

    public Response getAllUsers()
    {
        try
        {
            List<UserDto> list = new List<UserDto>();
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = "SELECT UserId, Username, Email, Role, IsActive, EmployeeId FROM Users";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                list.Add(ReadUser(dr));
            }

            conn.Close();

            return new Response
            {
                success = true,
                message = "Users loaded successfully",
                data = list
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response getUserById(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT UserId, Username, Email, Role, IsActive, EmployeeId FROM Users WHERE UserId = {id}";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "User not found." };
            }

            UserDto item = ReadUser(dr);
            conn.Close();

            return new Response
            {
                success = true,
                message = "User loaded successfully",
                data = item
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public User? getUserForAuth(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT UserId, Username, Email, Password, Role, IsActive, EmployeeId FROM Users WHERE UserId = {id}";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return null;
            }

            User user = new User
            {
                UserId = Convert.ToInt32(dr["UserId"]),
                Username = dr["Username"].ToString() ?? "",
                Email = dr["Email"].ToString() ?? "",
                Password = dr["Password"].ToString() ?? "",
                Role = dr["Role"].ToString() ?? "",
                IsActive = Convert.ToBoolean(dr["IsActive"]),
                EmployeeId = dr["EmployeeId"] == DBNull.Value ? null : Convert.ToInt32(dr["EmployeeId"])
            };

            conn.Close();
            return user;
        }
        catch
        {
            return null;
        }
    }

    public Response createUser(UserDto user)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(user.Password) || user.Password.Length < 6)
            {
                return new Response { success = false, message = "Password must be at least 6 characters." };
            }

            Response linkCheck = validateEmployeeLink(user.EmployeeId, 0);
            if (!linkCheck.success)
            {
                return linkCheck;
            }

            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"INSERT INTO Users (Username, Email, Password, Role, IsActive, EmployeeId) VALUES('{user.Username}', '{user.Email}', '{user.Password}', '{user.Role}', {(user.IsActive ? 1 : 0)}, {(user.EmployeeId <= 0 ? "NULL" : user.EmployeeId)})";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();

            if (result > 0 && user.EmployeeId > 0)
            {
                qry = $"SELECT UserId FROM Users WHERE Username = '{user.Username}'";
                cmd = new SqlCommand(qry, conn);
                int userId = Convert.ToInt32(cmd.ExecuteScalar());
                qry = $"UPDATE Employees SET UserId = {userId} WHERE EmployeeId = {user.EmployeeId} AND UserId IS NULL";
                cmd = new SqlCommand(qry, conn);
                cmd.ExecuteNonQuery();
            }

            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "User has been created successfully",
                    data = user
                };
            }

            return new Response { success = false, message = "There is database transaction error" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response updateUser(int id, UserDto user)
    {
        try
        {
            Response linkCheck = validateEmployeeLink(user.EmployeeId, id);
            if (!linkCheck.success)
            {
                return linkCheck;
            }

            string password = user.Password;
            if (string.IsNullOrWhiteSpace(password))
            {
                conn = new SqlConnection(con_str);
                conn.Open();
                qry = $"SELECT Password FROM Users WHERE UserId = {id}";
                cmd = new SqlCommand(qry, conn);
                password = cmd.ExecuteScalar()?.ToString() ?? "";
                conn.Close();
            }

            Response existingResponse = getUserById(id);
            if (!existingResponse.success)
            {
                return existingResponse;
            }

            UserDto existing = (UserDto)existingResponse.data!;

            conn = new SqlConnection(con_str);
            conn.Open();

            if (existing.EmployeeId > 0 && existing.EmployeeId != user.EmployeeId)
            {
                qry = $"UPDATE Employees SET UserId = NULL WHERE EmployeeId = {existing.EmployeeId} AND UserId = {id}";
                cmd = new SqlCommand(qry, conn);
                cmd.ExecuteNonQuery();
            }

            qry = $"UPDATE Users SET Username = '{user.Username}', Email = '{user.Email}', Password = '{password}', Role = '{user.Role}', IsActive = {(user.IsActive ? 1 : 0)}, EmployeeId = {(user.EmployeeId <= 0 ? "NULL" : user.EmployeeId)} WHERE UserId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();

            if (result > 0 && user.EmployeeId > 0)
            {
                qry = $"UPDATE Employees SET UserId = {id} WHERE EmployeeId = {user.EmployeeId} AND UserId IS NULL";
                cmd = new SqlCommand(qry, conn);
                cmd.ExecuteNonQuery();
            }

            conn.Close();

            if (result > 0)
            {
                user.UserId = id;
                user.Password = password;
                return new Response
                {
                    success = true,
                    message = "User has been updated successfully",
                    data = user
                };
            }

            return new Response { success = false, message = "User not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response deleteUser(int id)
    {
        try
        {
            Response existingResponse = getUserById(id);
            if (!existingResponse.success)
            {
                return existingResponse;
            }

            UserDto existing = (UserDto)existingResponse.data!;

            conn = new SqlConnection(con_str);
            conn.Open();

            if (existing.EmployeeId > 0)
            {
                qry = $"UPDATE Employees SET UserId = NULL WHERE EmployeeId = {existing.EmployeeId} AND UserId = {id}";
                cmd = new SqlCommand(qry, conn);
                cmd.ExecuteNonQuery();
            }

            qry = $"DELETE FROM Users WHERE UserId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "User has been deleted successfully"
                };
            }

            return new Response { success = false, message = "User not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private Response validateEmployeeLink(int employeeId, int currentUserId)
    {
        if (employeeId <= 0)
        {
            return new Response { success = true, message = "OK" };
        }

        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT UserId FROM Employees WHERE EmployeeId = {employeeId}";
            cmd = new SqlCommand(qry, conn);
            object? result = cmd.ExecuteScalar();
            conn.Close();

            if (result == null)
            {
                return new Response { success = false, message = "Employee not found." };
            }

            if (result != DBNull.Value)
            {
                int linkedUserId = Convert.ToInt32(result);
                if (linkedUserId != currentUserId)
                {
                    return new Response { success = false, message = "Employee already has a portal login." };
                }
            }

            return new Response { success = true, message = "OK" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private UserDto ReadUser(SqlDataReader reader)
    {
        return new UserDto
        {
            UserId = Convert.ToInt32(reader["UserId"]),
            Username = reader["Username"].ToString() ?? "",
            Email = reader["Email"].ToString() ?? "",
            Password = "",
            Role = reader["Role"].ToString() ?? "",
            IsActive = Convert.ToBoolean(reader["IsActive"]),
            EmployeeId = reader["EmployeeId"] == DBNull.Value ? 0 : Convert.ToInt32(reader["EmployeeId"])
        };
    }
}
