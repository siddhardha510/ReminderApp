using System.ComponentModel.DataAnnotations;
namespace ReminderApp.Api.Models
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime CreateAtUtc { get; set; } = DateTime.UtcNow;

        public ICollection<Bill> Bills { get; set; } = new List<Bill>();
        public ICollection<Warranty> warranties { get; set; } = new List<Warranty>();
    }
}
