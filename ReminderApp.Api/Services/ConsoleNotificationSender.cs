namespace ReminderApp.Api.Services;

public class ConsoleNotificationSender : INotificationSender
{
    private readonly ILogger<ConsoleNotificationSender> _logger;

    public ConsoleNotificationSender(ILogger<ConsoleNotificationSender> logger)
    {
        _logger = logger;
    }

    public Task SendBillReminderAsync(string? email, string? phoneNumber, string billTitle, decimal amount, DateOnly dueDate)
    {
        _logger.LogInformation(
            "[BILL ALERT] Recipient: {Contact} | Bill '{Title}' of {Amount:C} is due tomorrow ({DueDate:yyyy-MM-dd}).",
            email ?? phoneNumber ?? "Unknown", billTitle, amount, dueDate);
        return Task.CompletedTask;
    }

    public Task SendWarrantyReminderAsync(string? email, string? phoneNumber, string itemName, DateOnly expiryDate)
    {
        _logger.LogInformation(
            "[WARRANTY ALERT] Recipient: {Contact} | Warranty for '{ItemName}' expires in 30 days ({ExpiryDate:yyyy-MM-dd}).",
            email ?? phoneNumber ?? "Unknown", itemName, expiryDate);
        return Task.CompletedTask;
    }
}