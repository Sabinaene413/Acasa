using Acasa.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Acasa.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCities([FromQuery] int? countyId)
        {
            var query = _context.Cities.AsQueryable();

            if (countyId.HasValue)
            {
                query = query.Where(c => c.CountyId == countyId.Value);
            }

            var cities = await query
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.CountyId
                })
                .ToListAsync();

            return Ok(cities);
        }
    }
}
