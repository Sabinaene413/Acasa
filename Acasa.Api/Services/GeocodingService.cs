using Acasa.Api.Services.Interfaces;
using System.Globalization;

namespace Acasa.Api.Services
{
    public class GeocodingService : IGeocodingService
    {
        private readonly HttpClient _httpClient;

        public GeocodingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "AcasaApp/1.0");
        }

        public async Task<(double? Lat, double? Lng)> GeocodeAsync(string address, string city)
        {
            var query = Uri.EscapeDataString($"{address}, {city}, Romania");
            var url = $"https://nominatim.openstreetmap.org/search?q={query}&format=json&limit=1";

            var response = await _httpClient.GetFromJsonAsync<NominatimResult[]>(url);

            if (response != null && response.Length > 0)
                return (double.Parse(response[0].Lat, CultureInfo.InvariantCulture), double.Parse(response[0].Lon, CultureInfo.InvariantCulture));

            return (null, null);
        }
    }

    public class NominatimResult
    {
        public string Lat { get; set; } = string.Empty;
        public string Lon { get; set; } = string.Empty;
    }
}
