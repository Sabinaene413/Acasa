using Acasa.Api.Data;
using Acasa.Api.DTOs.SavedSearchDtos;
using Acasa.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace Acasa.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SavedSearchesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SavedSearchesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SavedSearchDto>>> GetSavedSearches()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var Searches = await _context.SavedSearches
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.CreatedAt)
                .Select(f => new SavedSearchDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    MinPrice = f.MinPrice,
                    MaxPrice = f.MaxPrice,
                    MinSurfaceArea = f.MinSurfaceArea,
                    MaxSurfaceArea = f.MaxSurfaceArea,
                    Bedrooms = f.Bedrooms,
                    Bathrooms = f.Bathrooms,
                    CityId = f.CityId,
                    CountyId = f.CountyId,
                    CreatedAt = f.CreatedAt
                })
                .ToListAsync();

            return Ok(Searches);
        }

        [HttpPost]
        public async Task<ActionResult<SavedSearchDto>> SaveSearch(SavedSearchCreateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var Search = new SavedSearch
            {
                UserId = userId,
                Name = dto.Name,
                MinPrice = dto.MinPrice,
                MaxPrice = dto.MaxPrice,
                MinSurfaceArea = dto.MinSurfaceArea,
                MaxSurfaceArea = dto.MaxSurfaceArea,
                Bedrooms = dto.Bedrooms,
                Bathrooms = dto.Bathrooms,
                CityId = dto.CityId,
                CountyId = dto.CountyId
            };

            _context.SavedSearches.Add(Search);
            await _context.SaveChangesAsync();

            return Ok(new SavedSearchDto
            {
                Id = Search.Id,
                Name = Search.Name,
                MinPrice = Search.MinPrice,
                MaxPrice = Search.MaxPrice,
                MinSurfaceArea = Search.MinSurfaceArea,
                MaxSurfaceArea = Search.MaxSurfaceArea,
                Bedrooms = Search.Bedrooms,
                Bathrooms = Search.Bathrooms,
                CityId = Search.CityId,
                CountyId = Search.CountyId,
                CreatedAt = Search.CreatedAt
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSearch(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var Search = await _context.SavedSearches
                .FirstOrDefaultAsync(f => f.Id == id && f.UserId == userId);

            if (Search == null) return NotFound();

            _context.SavedSearches.Remove(Search);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
