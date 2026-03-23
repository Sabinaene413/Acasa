using Acasa.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Acasa.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CountiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CountiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCounties()
        {
            var counties = await _context.Counties
                .Select(c => new
                {
                    c.Id,
                    c.Name
                })
                .ToListAsync();

            return Ok(counties);
        }
    }
}
