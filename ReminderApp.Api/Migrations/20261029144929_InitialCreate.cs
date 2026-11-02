using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ReminderApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: true),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    CreateAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Bills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric", nullable: false),
                    DueDate = table.Column<DateOnly>(type: "date", nullable: false),
                    BillReceiptUrl = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    ReminderSent = table.Column<bool>(type: "boolean", nullable: false),
                    CreateAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bills_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Warranties",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ItemName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Category = table.Column<string>(type: "character varying(80)", maxLength: 80, nullable: true),
                    PurchaseDate = table.Column<DateOnly>(type: "date", nullable: false),
                    ExpiryDate = table.Column<DateOnly>(type: "date", nullable: false),
                    InvoicePhotoUrl = table.Column<string>(type: "text", nullable: true),
                    ItemPhotoUrl = table.Column<string>(type: "text", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    ReminderSent = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Warranties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Warranties_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bills_DueDate",
                table: "Bills",
                column: "DueDate");

            migrationBuilder.CreateIndex(
                name: "IX_Bills_UserId_Title",
                table: "Bills",
                columns: new[] { "UserId", "Title" });

            migrationBuilder.CreateIndex(
                name: "IX_Warranties_ExpiryDate",
                table: "Warranties",
                column: "ExpiryDate");

            migrationBuilder.CreateIndex(
                name: "IX_Warranties_UserId_ItemName",
                table: "Warranties",
                columns: new[] { "UserId", "ItemName" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Bills");

            migrationBuilder.DropTable(
                name: "Warranties");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
