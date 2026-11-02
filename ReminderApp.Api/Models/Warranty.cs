using System.ComponentModel.DataAnnotations;
namespace ReminderApp.Api.Models
{
    public class Warranty
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        public User? User { get; set; }

        [Required]
        [MaxLength(150)]
        public string ItemName { get; set; } = string.Empty;

        [MaxLength(80)]
        public string? Category { get; set; }

        public DateOnly PurchaseDate { get; set; }

        public DateOnly ExpiryDate { get; set; }

        public string? InvoicePhotoUrl { get; set; }

        public string? ItemPhotoUrl { get; set; }

        public string? Notes { get; set; }

        public bool ReminderSent { get; set; } = false;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    }
}
