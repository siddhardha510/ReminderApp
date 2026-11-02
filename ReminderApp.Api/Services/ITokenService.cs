using ReminderApp.Api.Models;
namespace ReminderApp.Api.Services
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user);
        string GenerateRefreshToken();
        Task SaveRefreshTokenAsync(Guid userId, string refreshToken);
        Task<bool> ValidateRefreshTokenAsync(Guid userId, string refreshToken);
        Task RevokeRefreshTokenAsync(Guid userId);
    }
}
