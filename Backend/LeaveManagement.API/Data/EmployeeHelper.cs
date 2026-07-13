using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.Data.SqlClient;

namespace LeaveManagement.API.Data;

public class EmployeeHelper
{
    string con_str = "Data Source=MOHAMED;Initial Catalog=LeaveManagement;Integrated Security=True;Trust Server Certificate=True";
    SqlConnection conn;
    SqlCommand cmd;
    SqlDataReader dr;
    string qry;

    public Response getAllEmployees()
    {
        try
        {
            List<EmployeeDto> list = new List<EmployeeDto>();
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = "SELECT EmployeeId, UserId, DepartmentId, EmployeeCode, FirstName, LastName, Phone, HireDate, JobTitle, (SELECT DepartmentName FROM Departments WHERE DepartmentId = Employees.DepartmentId) AS DepartmentName FROM Employees";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                list.Add(ReadEmployee(dr));
            }

            conn.Close();

            return new Response
            {
                success = true,
                message = "Employees loaded successfully",
                data = list
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response getEmployeeById(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT EmployeeId, UserId, DepartmentId, EmployeeCode, FirstName, LastName, Phone, HireDate, JobTitle, (SELECT DepartmentName FROM Departments WHERE DepartmentId = Employees.DepartmentId) AS DepartmentName FROM Employees WHERE EmployeeId = {id}";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "Employee not found." };
            }

            EmployeeDto item = ReadEmployee(dr);
            conn.Close();

            return new Response
            {
                success = true,
                message = "Employee loaded successfully",
                data = item
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response createEmployee(EmployeeDto employee)
    {
        try
        {
            Response check = resolveDepartment(employee);
            if (!check.success)
            {
                return check;
            }

            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"INSERT INTO Employees (UserId, DepartmentId, EmployeeCode, FirstName, LastName, Phone, HireDate, JobTitle) VALUES({(employee.UserId <= 0 ? "NULL" : employee.UserId)}, {employee.DepartmentId}, '{employee.EmployeeCode}', '{employee.FirstName}', '{employee.LastName}', '{employee.Phone ?? ""}', '{employee.HireDate:yyyy-MM-dd}', '{employee.JobTitle}')";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Employee has been created successfully",
                    data = employee
                };
            }

            return new Response { success = false, message = "There is database transaction error" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response updateEmployee(int id, EmployeeDto employee)
    {
        try
        {
            Response check = resolveDepartment(employee);
            if (!check.success)
            {
                return check;
            }

            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"UPDATE Employees SET UserId = {(employee.UserId <= 0 ? "NULL" : employee.UserId)}, DepartmentId = {employee.DepartmentId}, EmployeeCode = '{employee.EmployeeCode}', FirstName = '{employee.FirstName}', LastName = '{employee.LastName}', Phone = '{employee.Phone ?? ""}', HireDate = '{employee.HireDate:yyyy-MM-dd}', JobTitle = '{employee.JobTitle}' WHERE EmployeeId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                employee.EmployeeId = id;
                return new Response
                {
                    success = true,
                    message = "Employee has been updated successfully",
                    data = employee
                };
            }

            return new Response { success = false, message = "Employee not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response deleteEmployee(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();

            qry = $"DELETE FROM LeaveRequests WHERE EmployeeId = {id}";
            cmd = new SqlCommand(qry, conn);
            cmd.ExecuteNonQuery();

            qry = $"UPDATE Users SET EmployeeId = NULL WHERE EmployeeId = {id}";
            cmd = new SqlCommand(qry, conn);
            cmd.ExecuteNonQuery();

            qry = $"DELETE FROM Employees WHERE EmployeeId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();

            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Employee has been deleted successfully"
                };
            }

            return new Response { success = false, message = "Employee not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private Response resolveDepartment(EmployeeDto employee)
    {
        if (employee.DepartmentId > 0)
        {
            return new Response { success = true, message = "OK" };
        }

        if (string.IsNullOrWhiteSpace(employee.DepartmentName))
        {
            return new Response { success = false, message = "Department is required." };
        }

        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT DepartmentId FROM Departments WHERE DepartmentName = '{employee.DepartmentName}'";
            cmd = new SqlCommand(qry, conn);
            object? result = cmd.ExecuteScalar();
            conn.Close();

            if (result == null || result == DBNull.Value)
            {
                return new Response { success = false, message = "Department not found." };
            }

            employee.DepartmentId = Convert.ToInt32(result);
            return new Response { success = true, message = "OK" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private EmployeeDto ReadEmployee(SqlDataReader reader)
    {
        return new EmployeeDto
        {
            EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
            UserId = reader["UserId"] == DBNull.Value ? 0 : Convert.ToInt32(reader["UserId"]),
            DepartmentId = Convert.ToInt32(reader["DepartmentId"]),
            EmployeeCode = reader["EmployeeCode"].ToString() ?? "",
            FirstName = reader["FirstName"].ToString() ?? "",
            LastName = reader["LastName"].ToString() ?? "",
            Phone = reader["Phone"] == DBNull.Value ? null : reader["Phone"].ToString(),
            HireDate = Convert.ToDateTime(reader["HireDate"]),
            JobTitle = reader["JobTitle"].ToString() ?? "",
            DepartmentName = reader["DepartmentName"].ToString() ?? ""
        };
    }
}
