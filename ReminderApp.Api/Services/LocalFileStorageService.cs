namespace ReminderApp.Api.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly IWebHostEnvironment _env;

    public LocalFileStorageService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> SaveFileAsync(IFormFile file, string subFolder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("Cannot upload an empty file.");

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var targetDir = Path.Combine(webRoot, "uploads", subFolder);

        if (!Directory.Exists(targetDir))
            Directory.CreateDirectory(targetDir);

        var extension = Path.GetExtension(file.FileName);
        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(targetDir, uniqueFileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        return $"/uploads/{subFolder}/{uniqueFileName}";
    }

    public Task DeleteFileAsync(string relativePath)
    {
        if (string.IsNullOrWhiteSpace(relativePath)) return Task.CompletedTask;

        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var fullPath = Path.Combine(webRoot, relativePath.TrimStart('/'));

        if (File.Exists(fullPath))
            File.Delete(fullPath);

        return Task.CompletedTask;
    }
}