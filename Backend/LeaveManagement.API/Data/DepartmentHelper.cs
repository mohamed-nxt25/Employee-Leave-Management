using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.Data.SqlClient;

namespace LeaveManagement.API.Data;

public class DepartmentHelper
{
    string con_str = "Data Source=MOHAMED;Initial Catalog=LeaveManagement;Integrated Security=True;Trust Server Certificate=True";
    SqlConnection conn;
    SqlCommand cmd;
    SqlDataReader dr;
    string qry;

    public Response getAllDepartments()
    {
        try
        {
            List<DepartmentDto> list = new List<DepartmentDto>();
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = "SELECT DepartmentId, DepartmentName, Description FROM Departments";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                list.Add(new DepartmentDto
                {
                    DepartmentId = Convert.ToInt32(dr["DepartmentId"]),
                    DepartmentName = dr["DepartmentName"].ToString() ?? "",
                    Description = dr["Description"] == DBNull.Value ? null : dr["Description"].ToString()
                });
            }

            conn.Close();

            return new Response
            {
                success = true,
                message = "Departments loaded successfully",
                data = list
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response getDepartmentById(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT DepartmentId, DepartmentName, Description FROM Departments WHERE DepartmentId = {id}";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "Department not found." };
            }

            DepartmentDto item = new DepartmentDto
            {
                DepartmentId = Convert.ToInt32(dr["DepartmentId"]),
                DepartmentName = dr["DepartmentName"].ToString() ?? "",
                Description = dr["Description"] == DBNull.Value ? null : dr["Description"].ToString()
            };

            conn.Close();

            return new Response
            {
                success = true,
                message = "Department loaded successfully",
                data = item
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response createDepartment(DepartmentDto department)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"INSERT INTO Departments (DepartmentName, Description) VALUES('{department.DepartmentName}', '{department.Description ?? ""}')";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Department has been created successfully",
                    data = department
                };
            }

            return new Response { success = false, message = "There is database transaction error" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response updateDepartment(int id, DepartmentDto department)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"UPDATE Departments SET DepartmentName = '{department.DepartmentName}', Description = '{department.Description ?? ""}' WHERE DepartmentId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                department.DepartmentId = id;
                return new Response
                {
                    success = true,
                    message = "Department has been updated successfully",
                    data = department
                };
            }

            return new Response { success = false, message = "Department not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response deleteDepartment(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"DELETE FROM Departments WHERE DepartmentId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Department has been deleted successfully"
                };
            }

            return new Response { success = false, message = "Department not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }
}
