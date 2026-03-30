namespace Acasa.Api.Services.Interfaces
{
    public interface IGeocodingService
    {
        Task<(double? Lat, double? Lng)> GeocodeAsync(string address, string city);
    }
}
