# Stage 1: Build the .NET API
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY ["ReminderApp.Api.csproj", "./"]
RUN dotnet restore "ReminderApp.Api.csproj"

COPY . .
RUN dotnet publish "ReminderApp.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Image
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
EXPOSE 8080

COPY --from=build /app/publish .

# Ensure wwwroot/uploads directory exists
RUN mkdir -p /app/wwwroot/uploads

ENTRYPOINT ["dotnet", "ReminderApp.Api.dll"]