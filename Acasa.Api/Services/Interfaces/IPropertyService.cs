using Acasa.Api.DTOs;

namespace Acasa.Api.Interfaces
{
    public interface IPropertyService
    {
        Task<IEnumerable<PropertyDto>> GetPropertiesAsync();
        Task<PropertyDto?> GetPropertyByIdAsync(int id);
        Task<IEnumerable<PropertyDto>> GetMyPropertiesAsync(string userId);
        Task<PagedResultDto<PropertyDto>> GetFilteredPropertiesAsync(PropertyFilterDto filter);
        Task<PropertyDto> CreatePropertyAsync(PropertyCreateDto propertyCreateDto, string userId);
        Task<PropertyDto?> UpdatePropertyAsync(int id, PropertyUpdateDto updateDto, string userId);
        Task<bool> DeletePropertyAsync(int id, string userId);
    }
}
