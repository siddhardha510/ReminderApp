using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.IdentityModel.Tokens;
using ReminderApp.Api.Models;

namespace ReminderApp.Api.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;
    private readonly IDistributedCache _cache;

    public TokenService(IConfiguration config, IDistributedCache cache)
    {
        _config = config;
        _cache = cache;
    }

    public string GenerateAccessToken(User user)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (!string.IsNullOrEmpty(user.Email))
            claims.Add(new Claim(ClaimTypes.Email, user.Email));

        if (!string.IsNullOrEmpty(user.PhoneNumber))
            claims.Add(new Claim(ClaimTypes.MobilePhone, user.PhoneNumber));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomBytes);
        return Convert.ToBase64String(randomBytes);
    }

    public async Task SaveRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(7) // 7-day session
        };

        await _cache.SetStringAsync($"refresh:{userId}", refreshToken, options);
    }

    public async Task<bool> ValidateRefreshTokenAsync(Guid userId, string refreshToken)
    {
        var cachedToken = await _cache.GetStringAsync($"refresh:{userId}");
        return cachedToken != null && cachedToken == refreshToken;
    }

    public async Task RevokeRefreshTokenAsync(Guid userId)
    {
        await _cache.RemoveAsync($"refresh:{userId}");
    }
}