using Acasa.Api.Data;
using Acasa.Api.DTOs;
using Acasa.Api.Models;
using Acasa.Api.Services;
using Acasa.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Acasa.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IPhotoService _photoService;
        private readonly IPropertyService _propertyService;

        public PropertiesController(ApplicationDbContext context, IPhotoService photoService, IPropertyService propertyService)
        {
            _context = context;
            _photoService = photoService;
            _propertyService = propertyService;
        }

        // GET: api/Properties/filter
        [HttpGet("filter")]
        public async Task<ActionResult> FilterProperties([FromQuery] PropertyFilterDto propertyFilterDto)
        {
            var result = await _propertyService.GetFilteredProperties(propertyFilterDto);
            return Ok(result);
        }

        // GET: api/Properties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties()
        {
            return await _context.Properties
                .Include(p => p.Images)
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    City = p.City,
                    Address = p.Address,
                    Bedrooms = p.Bedrooms,
                    Bathrooms = p.Bathrooms,
                    SurfaceArea = p.SurfaceArea,
                    UserId = p.UserId,
                    Images = p.Images.Select(i => new PropertyImageDto
                    {
                        Id = i.Id,
                        Url = i.Url
                    }).ToList()
                })
                .ToListAsync();
        }

        // GET: api/Properties/my-properties
        [HttpGet("my-properties")]
        [Authorize]  // obligatoriu - doar userii autentificati
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetMyProperties()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

            var properties = await _context.Properties
                .Where(p => p.UserId == userId)
                .Include(p => p.Images)
                .Select(p => new PropertyDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Description = p.Description,
                    Price = p.Price,
                    City = p.City,
                    Address = p.Address,
                    Bedrooms = p.Bedrooms,
                    Bathrooms = p.Bathrooms,
                    SurfaceArea = p.SurfaceArea,
                    UserId = p.UserId,
                    Images = p.Images!.Select(i => new PropertyImageDto
                    {
                        Id = i.Id,
                        Url = i.Url
                    }).ToList()
                })
                .ToListAsync();

            return Ok(properties);
        }

        // GET: api/Properties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDto>> GetProperty(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
            {
                return NotFound();
            }

            return new PropertyDto
            {
                Id = property.Id,
                Title = property.Title,
                Description = property.Description,
                Price = property.Price,
                City = property.City,
                Address = property.Address,
                Bedrooms = property.Bedrooms,
                Bathrooms = property.Bathrooms,
                SurfaceArea = property.SurfaceArea,
                UserId = property.UserId,
                Images = property.Images.Select(i => new PropertyImageDto
                {
                    Id = i.Id,
                    Url = i.Url
                }).ToList()
            };
        }

        // POST: api/Properties
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PropertyDto>> PostProperty([FromForm] PropertyCreateDto propertyCreateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var property = new Property
            {
                Title = propertyCreateDto.Title,
                Description = propertyCreateDto.Description,
                Price = propertyCreateDto.Price,
                CityId = propertyCreateDto.CityId,
                Address = propertyCreateDto.Address,
                Bedrooms = propertyCreateDto.Bedrooms,
                Bathrooms = propertyCreateDto.Bathrooms,
                SurfaceArea = propertyCreateDto.SurfaceArea,
                UserId = userId
            };

            if (propertyCreateDto.Images != null && propertyCreateDto.Images.Count > 0)
            {
                foreach (var file in propertyCreateDto.Images)
                {
                    var result = await _photoService.AddPhotoAsync(file);
                    if (result.Error != null) return BadRequest(result.Error.Message);

                    property.Images.Add(new PropertyImage
                    {
                        Url = result.SecureUrl.AbsoluteUri,
                        PublicId = result.PublicId
                    });
                }
            }

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProperty", new { id = property.Id }, new PropertyDto
            {
                Id = property.Id,
                Title = property.Title,
                Description = property.Description,
                Price = property.Price,
                Address = property.Address,
                Bedrooms = property.Bedrooms,
                Bathrooms = property.Bathrooms,
                SurfaceArea = property.SurfaceArea,
                UserId = property.UserId,
                Images = property.Images.Select(i => new PropertyImageDto
                {
                    Id = i.Id,
                    Url = i.Url
                }).ToList()
            });
        }

        // DELETE: api/Properties/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
            {
                return NotFound();
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (property.UserId != userId) return Forbid();

            // Delete images from Cloudinary
            foreach (var image in property.Images)
            {
                if (!string.IsNullOrEmpty(image.PublicId))
                {
                    await _photoService.DeletePhotoAsync(image.PublicId);
                }
            }

            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
