using LeaveManagement.API.DTOs;
using LeaveManagement.API.Models;
using Microsoft.Data.SqlClient;

namespace LeaveManagement.API.Data;

public class LeaveRequestHelper
{
    string con_str = "Data Source=MOHAMED;Initial Catalog=LeaveManagement;Integrated Security=True;Trust Server Certificate=True";
    SqlConnection conn;
    SqlCommand cmd;
    SqlDataReader dr;
    string qry;

    public Response getAllLeaveRequests()
    {
        try
        {
            List<LeaveRequestDto> list = new List<LeaveRequestDto>();
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = "SELECT LeaveRequestId, EmployeeId, LeaveTypeId, StartDate, EndDate, TotalDays, Reason, Status, RequestedAt, ReviewedByUserId, ReviewedAt, (SELECT FirstName + ' ' + LastName FROM Employees WHERE EmployeeId = LeaveRequests.EmployeeId) AS EmployeeName, (SELECT TypeName FROM LeaveTypes WHERE LeaveTypeId = LeaveRequests.LeaveTypeId) AS LeaveTypeName FROM LeaveRequests ORDER BY RequestedAt DESC";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                list.Add(ReadLeaveRequest(dr));
            }

            conn.Close();

            return new Response
            {
                success = true,
                message = "Leave requests loaded successfully",
                data = list
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response getLeaveRequestById(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"SELECT LeaveRequestId, EmployeeId, LeaveTypeId, StartDate, EndDate, TotalDays, Reason, Status, RequestedAt, ReviewedByUserId, ReviewedAt, (SELECT FirstName + ' ' + LastName FROM Employees WHERE EmployeeId = LeaveRequests.EmployeeId) AS EmployeeName, (SELECT TypeName FROM LeaveTypes WHERE LeaveTypeId = LeaveRequests.LeaveTypeId) AS LeaveTypeName FROM LeaveRequests WHERE LeaveRequestId = {id}";
            cmd = new SqlCommand(qry, conn);
            dr = cmd.ExecuteReader();

            if (!dr.Read())
            {
                conn.Close();
                return new Response { success = false, message = "Leave request not found." };
            }

            LeaveRequestDto item = ReadLeaveRequest(dr);
            conn.Close();

            return new Response
            {
                success = true,
                message = "Leave request loaded successfully",
                data = item
            };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response createLeaveRequest(LeaveRequestDto leaveRequest)
    {
        try
        {
            Response check = resolveIds(leaveRequest);
            if (!check.success)
            {
                return check;
            }

            if (leaveRequest.EndDate < leaveRequest.StartDate)
            {
                return new Response { success = false, message = "End date must be after start date." };
            }

            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"INSERT INTO LeaveRequests (EmployeeId, LeaveTypeId, StartDate, EndDate, TotalDays, Reason, Status, ReviewedByUserId, ReviewedAt) VALUES({leaveRequest.EmployeeId}, {leaveRequest.LeaveTypeId}, '{leaveRequest.StartDate:yyyy-MM-dd}', '{leaveRequest.EndDate:yyyy-MM-dd}', {leaveRequest.TotalDays}, '{leaveRequest.Reason}', '{(string.IsNullOrWhiteSpace(leaveRequest.Status) ? "Pending" : leaveRequest.Status)}', {(leaveRequest.ReviewedByUserId == null ? "NULL" : leaveRequest.ReviewedByUserId)}, {(leaveRequest.ReviewedAt == null ? "NULL" : $"'{leaveRequest.ReviewedAt:yyyy-MM-dd HH:mm:ss}'")})";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                if (string.IsNullOrWhiteSpace(leaveRequest.Status))
                {
                    leaveRequest.Status = "Pending";
                }
                return new Response
                {
                    success = true,
                    message = "Leave request has been created successfully",
                    data = leaveRequest
                };
            }

            return new Response { success = false, message = "There is database transaction error" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response updateLeaveRequest(int id, LeaveRequestDto leaveRequest)
    {
        try
        {
            Response check = resolveIds(leaveRequest);
            if (!check.success)
            {
                return check;
            }

            if (leaveRequest.EndDate < leaveRequest.StartDate)
            {
                return new Response { success = false, message = "End date must be after start date." };
            }

            if (leaveRequest.Status == "Approved" || leaveRequest.Status == "Rejected")
            {
                leaveRequest.ReviewedAt = DateTime.Now;
            }

            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"UPDATE LeaveRequests SET EmployeeId = {leaveRequest.EmployeeId}, LeaveTypeId = {leaveRequest.LeaveTypeId}, StartDate = '{leaveRequest.StartDate:yyyy-MM-dd}', EndDate = '{leaveRequest.EndDate:yyyy-MM-dd}', TotalDays = {leaveRequest.TotalDays}, Reason = '{leaveRequest.Reason}', Status = '{leaveRequest.Status}', ReviewedByUserId = {(leaveRequest.ReviewedByUserId == null ? "NULL" : leaveRequest.ReviewedByUserId)}, ReviewedAt = {(leaveRequest.ReviewedAt == null ? "NULL" : $"'{leaveRequest.ReviewedAt:yyyy-MM-dd HH:mm:ss}'")} WHERE LeaveRequestId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                leaveRequest.LeaveRequestId = id;
                return new Response
                {
                    success = true,
                    message = "Leave request has been updated successfully",
                    data = leaveRequest
                };
            }

            return new Response { success = false, message = "Leave request not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    public Response deleteLeaveRequest(int id)
    {
        try
        {
            conn = new SqlConnection(con_str);
            conn.Open();
            qry = $"DELETE FROM LeaveRequests WHERE LeaveRequestId = {id}";
            cmd = new SqlCommand(qry, conn);
            int result = cmd.ExecuteNonQuery();
            conn.Close();

            if (result > 0)
            {
                return new Response
                {
                    success = true,
                    message = "Leave request has been deleted successfully"
                };
            }

            return new Response { success = false, message = "Leave request not found." };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private Response resolveIds(LeaveRequestDto leaveRequest)
    {
        try
        {
            if (leaveRequest.EmployeeId <= 0 && !string.IsNullOrWhiteSpace(leaveRequest.EmployeeName))
            {
                string[] parts = leaveRequest.EmployeeName.Trim().Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length < 2)
                {
                    return new Response { success = false, message = "Employee name must be 'FirstName LastName'." };
                }

                conn = new SqlConnection(con_str);
                conn.Open();
                qry = $"SELECT EmployeeId FROM Employees WHERE FirstName = '{parts[0]}' AND LastName = '{parts[1]}'";
                cmd = new SqlCommand(qry, conn);
                object? empId = cmd.ExecuteScalar();
                conn.Close();

                if (empId == null || empId == DBNull.Value)
                {
                    return new Response { success = false, message = "Employee not found." };
                }

                leaveRequest.EmployeeId = Convert.ToInt32(empId);
            }

            if (leaveRequest.LeaveTypeId <= 0 && !string.IsNullOrWhiteSpace(leaveRequest.LeaveTypeName))
            {
                conn = new SqlConnection(con_str);
                conn.Open();
                qry = $"SELECT LeaveTypeId FROM LeaveTypes WHERE TypeName = '{leaveRequest.LeaveTypeName}'";
                cmd = new SqlCommand(qry, conn);
                object? typeId = cmd.ExecuteScalar();
                conn.Close();

                if (typeId == null || typeId == DBNull.Value)
                {
                    return new Response { success = false, message = "Leave type not found." };
                }

                leaveRequest.LeaveTypeId = Convert.ToInt32(typeId);
            }

            if (leaveRequest.EmployeeId <= 0)
            {
                return new Response { success = false, message = "Employee is required." };
            }

            if (leaveRequest.LeaveTypeId <= 0)
            {
                return new Response { success = false, message = "Leave type is required." };
            }

            return new Response { success = true, message = "OK" };
        }
        catch (Exception ex)
        {
            return new Response { success = false, message = ex.Message };
        }
    }

    private LeaveRequestDto ReadLeaveRequest(SqlDataReader reader)
    {
        return new LeaveRequestDto
        {
            LeaveRequestId = Convert.ToInt32(reader["LeaveRequestId"]),
            EmployeeId = Convert.ToInt32(reader["EmployeeId"]),
            EmployeeName = reader["EmployeeName"].ToString() ?? "",
            LeaveTypeId = Convert.ToInt32(reader["LeaveTypeId"]),
            LeaveTypeName = reader["LeaveTypeName"].ToString() ?? "",
            StartDate = Convert.ToDateTime(reader["StartDate"]),
            EndDate = Convert.ToDateTime(reader["EndDate"]),
            TotalDays = Convert.ToInt32(reader["TotalDays"]),
            Reason = reader["Reason"].ToString() ?? "",
            Status = reader["Status"].ToString() ?? "",
            RequestedAt = Convert.ToDateTime(reader["RequestedAt"]),
            ReviewedByUserId = reader["ReviewedByUserId"] == DBNull.Value ? null : Convert.ToInt32(reader["ReviewedByUserId"]),
            ReviewedAt = reader["ReviewedAt"] == DBNull.Value ? null : Convert.ToDateTime(reader["ReviewedAt"])
        };
    }
}
