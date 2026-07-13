using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.Data.SqlClient;

namespace LeaveManagement.API.Data;

public class LeaveTypeHelper
{
    string con_str = "Data Source=MOHAMED;Initial Catalog=LeaveManagement;Integrated Security=True;Trust Server Certificate=True";
    SqlConnection conn;
    SqlCommand cmd;
    SqlDataReader dr;
    string qry;

    public Response getAllLeaveTypes()
    {
        try
        {
            List<LeaveTypeDto> list = new List<LeaveTypeDto>();
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = "SELECT LeaveTypeId, TypeName, Description, MaxDaysPerYear, IsPaid FROM LeaveTypes";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                list.Add(ReadLeaveType(dr));
            }

            conn.Close();

            return new Response
            {
                success = true,
                message = "Leave types loaded successfully",
                data = list
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response getLeaveTypeById(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT LeaveTypeId, TypeName, Description, MaxDaysPerYear, IsPaid FROM LeaveTypes WHERE LeaveTypeId = {id}";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "Leave type not found." };
            }

            LeaveTypeDto item = ReadLeaveType(dr);
            conn.Close();

            return new Response
            {
                success = true,
                message = "Leave type loaded successfully",
                data = item
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response createLeaveType(LeaveTypeDto leaveType)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"INSERT INTO LeaveTypes (TypeName, Description, MaxDaysPerYear, IsPaid) VALUES('{leaveType.TypeName}', '{leaveType.Description ?? ""}', {leaveType.MaxDaysPerYear}, {(leaveType.IsPaid ? 1 : 0)})";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Leave type has been created successfully",
                    data = leaveType
                };
            }

            return new Response { success = false, message = "There is database transaction error" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response updateLeaveType(int id, LeaveTypeDto leaveType)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"UPDATE LeaveTypes SET TypeName = '{leaveType.TypeName}', Description = '{leaveType.Description ?? ""}', MaxDaysPerYear = {leaveType.MaxDaysPerYear}, IsPaid = {(leaveType.IsPaid ? 1 : 0)} WHERE LeaveTypeId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                leaveType.LeaveTypeId = id;
                return new Response
                {
                    success = true,
                    message = "Leave type has been updated successfully",
                    data = leaveType
                };
            }

            return new Response { success = false, message = "Leave type not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response deleteLeaveType(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"DELETE FROM LeaveTypes WHERE LeaveTypeId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Leave type has been deleted successfully"
                };
            }

            return new Response { success = false, message = "Leave type not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private LeaveTypeDto ReadLeaveType(SqlDataReader reader)
    {
        return new LeaveTypeDto
        {
            LeaveTypeId = Convert.ToInt32(reader["LeaveTypeId"]),
            TypeName = reader["TypeName"].ToString() ?? "",
            Description = reader["Description"] == DBNull.Value ? null : reader["Description"].ToString(),
            MaxDaysPerYear = Convert.ToInt32(reader["MaxDaysPerYear"]),
            IsPaid = Convert.ToBoolean(reader["IsPaid"])
        };
    }
}
