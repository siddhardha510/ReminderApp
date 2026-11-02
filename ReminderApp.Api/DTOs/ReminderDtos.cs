using System.ComponentModel.DataAnnotations;
using ReminderApp.Api.Models;

namespace ReminderApp.Api.DTOs;

// --- Bills DTOs ---
public record CreateBillRequest(
    [Required] string Title,
    BillCategory Category,
    [Range(0.01, 10000000)] decimal Amount,
    DateOnly DueDate
);

public record BillResponse(
    Guid Id,
    string Title,
    string Category,
    decimal Amount,
    DateOnly DueDate,
    string? BillReceiptUrl,
    string Status,
    bool ReminderSent
);

// --- Warranty DTOs ---
public record CreateWarrantyRequest(
    [Required] string ItemName,
    string? Category,
    DateOnly PurchaseDate,
    DateOnly ExpiryDate,
    string? Notes
);

public record WarrantyResponse(
    Guid Id,
    string ItemName,
    string? Category,
    DateOnly PurchaseDate,
    DateOnly ExpiryDate,
    string? InvoicePhotoUrl,
    string? ItemPhotoUrl,
    string? Notes,
    bool ReminderSent
);

// --- Global Search Result ---
public record SearchItemResponse(
    Guid Id,
    string Title,
    string Type, // "Bill" or "Warranty"
    string? Category,
    DateOnly TargetDate, // DueDate or ExpiryDate
    string? Status,
    string? ImageUrl
);