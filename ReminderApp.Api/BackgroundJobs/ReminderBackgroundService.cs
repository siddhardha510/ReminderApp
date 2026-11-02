using Microsoft.EntityFrameworkCore;
using ReminderApp.Api.Data;
using ReminderApp.Api.Models;
using ReminderApp.Api.Services;

namespace ReminderApp.Api.BackgroundJobs;

public class ReminderBackgroundService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<ReminderBackgroundService> _logger;

    // Run interval: once every 24 hours (or adjust to shorter duration for testing)
    private readonly TimeSpan _checkInterval = TimeSpan.FromHours(24);

    public ReminderBackgroundService(
        IServiceScopeFactory scopeFactory,
        ILogger<ReminderBackgroundService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ReminderBackgroundService started running.");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessRemindersAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while executing daily reminders.");
            }

            // Wait for the next 24-hour cycle or until shutdown
            await Task.Delay(_checkInterval, stoppingToken);
        }
    }

    private async Task ProcessRemindersAsync(CancellationToken cancellationToken)
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var notifier = scope.ServiceProvider.GetRequiredService<INotificationSender>();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var tomorrow = today.AddDays(1);
        var thirtyDaysLater = today.AddDays(30);

        _logger.LogInformation("Scanning for reminders. Today: {Today}", today);

        // 1. Process Bills due in 1 day (Tomorrow)
        var upcomingBills = await context.Bills
            .Include(b => b.User)
            .Where(b => b.DueDate == tomorrow
                     && b.Status == BillStatus.Pending
                     && !b.ReminderSent)
            .ToListAsync(cancellationToken);

        foreach (var bill in upcomingBills)
        {
            await notifier.SendBillReminderAsync(
                bill.User?.Email,
                bill.User?.PhoneNumber,
                bill.Title,
                bill.Amount,
                bill.DueDate);

            bill.ReminderSent = true;
        }

        // 2. Process Warranties expiring in 30 days
        var expiringWarranties = await context.Warranties
            .Include(w => w.User)
            .Where(w => w.ExpiryDate == thirtyDaysLater
                     && !w.ReminderSent)
            .ToListAsync(cancellationToken);

        foreach (var warranty in expiringWarranties)
        {
            await notifier.SendWarrantyReminderAsync(
                warranty.User?.Email,
                warranty.User?.PhoneNumber,
                warranty.ItemName,
                warranty.ExpiryDate);

            warranty.ReminderSent = true;
        }

        if (upcomingBills.Any() || expiringWarranties.Any())
        {
            await context.SaveChangesAsync(cancellationToken);
            _logger.LogInformation(
                "Reminders dispatched: {BillCount} bills, {WarrantyCount} warranties.",
                upcomingBills.Count, expiringWarranties.Count);
        }
        else
        {
            _logger.LogInformation("No pending reminders due for today's check.");
        }
    }
}