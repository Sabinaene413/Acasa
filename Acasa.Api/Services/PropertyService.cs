using Acasa.Api.Data;
using Acasa.Api.DTOs;
using Acasa.Api.Models;
using Acasa.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Acasa.Api.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly ApplicationDbContext _context;
        public PropertyService(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<PropertyDto>> GetFilteredProperties(PropertyFilterDto filter)
        {
            if (filter == null)
                filter = new PropertyFilterDto();

            var query = _context.Properties
                .Include(p => p.Images)
                .AsQueryable();

            if (filter.CityId.HasValue)
                query = query.Where(p => p.CityId == filter.CityId.Value);

            if (filter.CountyId.HasValue)
                query = query.Where(p => p.City != null && p.City.CountyId == filter.CountyId.Value);

            if (filter.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filter.MinPrice.Value);

            if (filter.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filter.MaxPrice.Value);

            if (filter.MinSurfaceArea.HasValue)
                query = query.Where(p => p.SurfaceArea >= filter.MinSurfaceArea.Value);

            if (filter.MaxSurfaceArea.HasValue)
                query = query.Where(p => p.SurfaceArea <= filter.MaxSurfaceArea.Value);

            if (filter.Bedrooms.HasValue)
                query = query.Where(p => p.Bedrooms == filter.Bedrooms.Value);

            if (filter.Bathrooms.HasValue)
                query = query.Where(p => p.Bathrooms == filter.Bathrooms.Value);

            return await query
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
        }
    }
}
