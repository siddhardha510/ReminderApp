using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using ReminderApp.Api.Data;
using ReminderApp.Api.DTOs;

namespace ReminderApp.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IDistributedCache _cache;

    public SearchController(AppDbContext context, IDistributedCache cache)
    {
        _context = context;
        _cache = cache;
    }

    private Guid GetCurrentUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SearchItemResponse>>> Search([FromQuery] string? query)
    {
        var userId = GetCurrentUserId();
        var normalizedQuery = query?.Trim().ToLower() ?? string.Empty;

        // Cache Key scoped by user and search term
        var cacheKey = $"search:{userId}:{normalizedQuery}";

        // 1. Check Redis Cache
        var cachedData = await _cache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cachedData))
        {
            var cachedResults = JsonSerializer.Deserialize<List<SearchItemResponse>>(cachedData);
            return Ok(cachedResults);
        }

        // 2. Query Bills matching title or category
        var matchingBills = await _context.Bills
            .Where(b => b.UserId == userId &&
                        (string.IsNullOrEmpty(normalizedQuery) ||
                         b.Title.ToLower().Contains(normalizedQuery)))
            .Select(b => new SearchItemResponse(
                b.Id,
                b.Title,
                "Bill",
                b.Category.ToString(),
                b.DueDate,
                b.Status.ToString(),
                b.BillReceiptUrl
            ))
            .ToListAsync();

        // 3. Query Warranties matching item name, category, or notes
        var matchingWarranties = await _context.Warranties
            .Where(w => w.UserId == userId &&
                        (string.IsNullOrEmpty(normalizedQuery) ||
                         w.ItemName.ToLower().Contains(normalizedQuery) ||
                         (w.Category != null && w.Category.ToLower().Contains(normalizedQuery)) ||
                         (w.Notes != null && w.Notes.ToLower().Contains(normalizedQuery))))
            .Select(w => new SearchItemResponse(
                w.Id,
                w.ItemName,
                "Warranty",
                w.Category,
                w.ExpiryDate,
                w.ExpiryDate < DateOnly.FromDateTime(DateTime.UtcNow) ? "Expired" : "Active",
                w.ItemPhotoUrl ?? w.InvoicePhotoUrl
            ))
            .ToListAsync();

        // 4. Combine and order by the closest target date
        var combinedResults = matchingBills
            .Concat(matchingWarranties)
            .OrderBy(item => item.TargetDate)
            .ToList();

        // 5. Save to Redis Cache (5-minute TTL to keep fresh with user additions)
        var cacheOptions = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
        };

        var serialized = JsonSerializer.Serialize(combinedResults);
        await _cache.SetStringAsync(cacheKey, serialized, cacheOptions);

        return Ok(combinedResults);
    }
}