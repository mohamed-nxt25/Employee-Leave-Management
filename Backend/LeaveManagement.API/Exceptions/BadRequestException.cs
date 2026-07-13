namespace LeaveManagement.API.Exceptions;

// Use when data is wrong -> HTTP 400
public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }
}
