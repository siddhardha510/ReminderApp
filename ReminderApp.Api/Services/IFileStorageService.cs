namespace ReminderApp.Api.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string subFolder);
    Task DeleteFileAsync(string relativePath);
}