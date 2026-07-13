namespace LeaveManagement.API.Models;

public class Response
{
    public bool success { get; set; }
    public string message { get; set; } = string.Empty;
    public object? data { get; set; }
}
