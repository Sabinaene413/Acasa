using Acasa.Api.Data;
using Acasa.Api.DTOs;
using Acasa.Api.Interfaces;
using Acasa.Api.Models;
using Acasa.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Acasa.Api.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPhotoService _photoService;

        public PropertyService(ApplicationDbContext context, IPhotoService photoService)
        {
            _context = context;
            _photoService = photoService;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesAsync()
        {
            return await _context.Properties
                .Include(p => p.Images)
                .Include(p => p.City)
                .Select(p => MapToDto(p))
                .ToListAsync();
        }

        public async Task<PropertyDto?> GetPropertyByIdAsync(int id)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .Include(p => p.City)
                .FirstOrDefaultAsync(p => p.Id == id);

            return property == null ? null : MapToDto(property);
        }

        public async Task<IEnumerable<PropertyDto>> GetMyPropertiesAsync(string userId)
        {
            return await _context.Properties
                .Where(p => p.UserId == userId)
                .Include(p => p.Images)
                .Select(p => MapToDto(p))
                .ToListAsync();
        }

        public async Task<IEnumerable<PropertyDto>> GetFilteredPropertiesAsync(PropertyFilterDto filter)
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
                        .Select(p => MapToDto(p))
                .ToListAsync();
        }

        public async Task<PropertyDto> CreatePropertyAsync(PropertyCreateDto propertyCreateDto, string userId)
        {
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
                    if (result.Error == null)
                    {
                        property.Images.Add(new PropertyImage
                        {
                            Url = result.SecureUrl.AbsoluteUri,
                            PublicId = result.PublicId
                        });
                    }
                }
            }

            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return MapToDto(property);
        }

        public async Task<PropertyDto?> UpdatePropertyAsync(int id, PropertyUpdateDto updateDto, string userId)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .Include(p => p.City)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null || property.UserId != userId)
            {
                return null;
            }

            property.Title = updateDto.Title;
            property.Description = updateDto.Description;
            property.Price = updateDto.Price;
            property.CityId = updateDto.CityId;
            property.Address = updateDto.Address;
            property.Bedrooms = updateDto.Bedrooms;
            property.Bathrooms = updateDto.Bathrooms;
            property.SurfaceArea = updateDto.SurfaceArea;

            if (updateDto.ImagesToDelete != null && updateDto.ImagesToDelete.Count > 0)
            {
                var imagesToRemove = property.Images
                    .Where(i => updateDto.ImagesToDelete.Contains(i.Id))
                    .ToList();

                foreach (var image in imagesToRemove)
                {
                    if (!string.IsNullOrEmpty(image.PublicId))
                    {
                        await _photoService.DeletePhotoAsync(image.PublicId);
                    }
                    property.Images.Remove(image);
                }
            }

            if (updateDto.NewImages != null && updateDto.NewImages.Count > 0)
            {
                foreach (var file in updateDto.NewImages)
                {
                    var result = await _photoService.AddPhotoAsync(file);
                    if (result.Error == null)
                    {
                        property.Images.Add(new PropertyImage
                        {
                            Url = result.SecureUrl.AbsoluteUri,
                            PublicId = result.PublicId
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();
            await _context.Entry(property).Reference(p => p.City).LoadAsync();

            return MapToDto(property);
        }

        public async Task<bool> DeletePropertyAsync(int id, string userId)
        {
            var property = await _context.Properties
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null || property.UserId != userId)
            {
                return false;
            }

            foreach (var image in property.Images)
            {
                if (!string.IsNullOrEmpty(image.PublicId))
                {
                    await _photoService.DeletePhotoAsync(image.PublicId);
                }
            }

            _context.Properties.Remove(property);
            return await _context.SaveChangesAsync() > 0;
        }

        private static PropertyDto MapToDto(Property property)
        {
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
    }
}
