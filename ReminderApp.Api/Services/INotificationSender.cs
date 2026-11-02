namespace ReminderApp.Api.Services;

public interface INotificationSender
{
    Task SendBillReminderAsync(string? email, string? phoneNumber, string billTitle, decimal amount, DateOnly dueDate);
    Task SendWarrantyReminderAsync(string? email, string? phoneNumber, string itemName, DateOnly expiryDate);
}