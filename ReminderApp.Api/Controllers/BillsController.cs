using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReminderApp.Api.Data;
using ReminderApp.Api.DTOs;
using ReminderApp.Api.Models;
using ReminderApp.Api.Services;

namespace ReminderApp.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BillsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IFileStorageService _fileStorage;

    public BillsController(AppDbContext context, IFileStorageService fileStorage)
    {
        _context = context;
        _fileStorage = fileStorage;
    }

    private Guid GetCurrentUserId() =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BillResponse>>> GetUserBills()
    {
        var userId = GetCurrentUserId();
        var bills = await _context.Bills
            .Where(b => b.UserId == userId)
            .OrderBy(b => b.DueDate)
            .Select(b => new BillResponse(
                b.Id, b.Title, b.Category.ToString(), b.Amount, b.DueDate,
                b.BillReceiptUrl, b.Status.ToString(), b.ReminderSent))
            .ToListAsync();

        return Ok(bills);
    }

    [HttpPost]
    public async Task<ActionResult<BillResponse>> CreateBill([FromBody] CreateBillRequest request)
    {
        var userId = GetCurrentUserId();

        var bill = new Bill
        {
            UserId = userId,
            Title = request.Title,
            Category = request.Category,
            Amount = request.Amount,
            DueDate = request.DueDate,
            Status = BillStatus.Pending
        };

        _context.Bills.Add(bill);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUserBills), new { id = bill.Id },
            new BillResponse(bill.Id, bill.Title, bill.Category.ToString(), bill.Amount, bill.DueDate, bill.BillReceiptUrl, bill.Status.ToString(), bill.ReminderSent));
    }

    [HttpPost("{id:guid}/upload-receipt")]
    public async Task<IActionResult> UploadReceipt(Guid id, IFormFile file)
    {
        var userId = GetCurrentUserId();
        var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        if (bill == null) return NotFound(new { message = "Bill not found." });

        var filePath = await _fileStorage.SaveFileAsync(file, "bills");
        bill.BillReceiptUrl = filePath;
        await _context.SaveChangesAsync();

        return Ok(new { receiptUrl = filePath });
    }

    [HttpPatch("{id:guid}/mark-paid")]
    public async Task<IActionResult> MarkAsPaid(Guid id)
    {
        var userId = GetCurrentUserId();
        var bill = await _context.Bills.FirstOrDefaultAsync(b => b.Id == id && b.UserId == userId);
        if (bill == null) return NotFound(new { message = "Bill not found." });

        bill.Status = BillStatus.Paid;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Bill marked as paid." });
    }
}