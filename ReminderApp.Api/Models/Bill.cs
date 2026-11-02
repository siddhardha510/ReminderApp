using System.ComponentModel.DataAnnotations;
namespace ReminderApp.Api.Models;

public enum BillCategory
{
    Emi,
    CreditCard,
    Electricity,
    Gas,
    MobileRecharge,
    Other
}
public enum BillStatus
{
    Pending,
    Paid,
    Overdue
}
public class Bill
{
    public Guid Id { get; set; }= Guid.NewGuid();

    [Required]
    public Guid UserId { get; set;  }
    public User? User { get; set; }

    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    public BillCategory Category { get; set; }
    
    public decimal Amount {  get; set; }

    public DateOnly DueDate { get; set; }

    public string? BillReceiptUrl { get; set; }

    public BillStatus Status { get; set; } = BillStatus.Pending;
    public bool ReminderSent { get; set; }= false;
    public DateTime CreateAtUtc { get; set; } = DateTime.UtcNow;
}
