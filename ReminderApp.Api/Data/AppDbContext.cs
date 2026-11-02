using Microsoft.EntityFrameworkCore;
using ReminderApp.Api.Models;
namespace ReminderApp.Api.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Bill> Bills => Set<Bill>();
        public DbSet<Warranty> Warranties => Set<Warranty>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Indexes for search and background reminder queries
            modelBuilder.Entity<Bill>()
                .HasIndex(b => b.DueDate);

            modelBuilder.Entity<Bill>()
                .HasIndex(b => new { b.UserId, b.Title });

            modelBuilder.Entity<Warranty>()
                .HasIndex(w => w.ExpiryDate);

            modelBuilder.Entity<Warranty>()
                .HasIndex(w => new { w.UserId, w.ItemName });
        }
    }
}
