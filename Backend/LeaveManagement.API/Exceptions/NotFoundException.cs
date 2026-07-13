namespace LeaveManagement.API.Exceptions;

// Use when record not found -> HTTP 404
public class NotFoundException : Exception
{
    public NotFoundException(string message) : base(message) { }
}
