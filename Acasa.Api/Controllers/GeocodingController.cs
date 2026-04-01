using Acasa.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Acasa.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GeocodingController : ControllerBase
    {
        private readonly IGeocodingService _geocodingService;

        public GeocodingController(IGeocodingService geocodingService)
        {
            _geocodingService = geocodingService;
        }

        [HttpGet]
        public async Task<IActionResult> Geocode([FromQuery] string address, [FromQuery] string city)
        {
            if (string.IsNullOrWhiteSpace(address) || string.IsNullOrWhiteSpace(city))
                return BadRequest("Adresa și orașul sunt obligatorii.");

            var (lat, lng) = await _geocodingService.GeocodeAsync(address, city);

            if (lat == null || lng == null)
                return NotFound("Nu s-a putut găsi locația.");

            return Ok(new { latitude = lat, longitude = lng });
        }
    }
}
