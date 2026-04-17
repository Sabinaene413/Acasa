using Acasa.Api.DTOs;
using Acasa.Api.DTOs.PropertyDtos;
using Acasa.Api.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Acasa.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;

        public PropertiesController(IPropertyService propertyService)
        {
            _propertyService = propertyService;
        }

        // GET: api/Properties/filter
        [HttpGet("filter")]
        public async Task<ActionResult<PagedResultDto<PropertyDto>>> FilterProperties([FromQuery] PropertyFilterDto propertyFilterDto)
        {
            var result = await _propertyService.GetFilteredPropertiesAsync(propertyFilterDto);
            return Ok(result);
        }

        // GET: api/Properties
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties()
        {
            var result = await _propertyService.GetPropertiesAsync();
            return Ok(result);
        }

        // GET: api/Properties/my-properties
        [HttpGet("my-properties")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetMyProperties()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var properties = await _propertyService.GetMyPropertiesAsync(userId);
            return Ok(properties);
        }

        // GET: api/Properties/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDto>> GetProperty(int id)
        {
            var property = await _propertyService.GetPropertyByIdAsync(id);

            if (property == null)
            {
                return NotFound();
            }

            return Ok(property);
        }

        // POST: api/Properties
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PropertyDto>> PostProperty([FromForm] PropertyCreateDto propertyCreateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _propertyService.CreatePropertyAsync(propertyCreateDto, userId);

            return CreatedAtAction(nameof(GetProperty), new { id = result.Id }, result);
        }

        // PUT: api/Properties/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult<PropertyDto>> PutProperty(int id, [FromForm] PropertyUpdateDto updateDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var result = await _propertyService.UpdatePropertyAsync(id, updateDto, userId);

            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        // DELETE: api/Properties/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProperty(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var deleted = await _propertyService.DeletePropertyAsync(id, userId);

            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
