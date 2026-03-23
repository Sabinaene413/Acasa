using Acasa.Api.DTOs;
using Acasa.Api.Models;

namespace Acasa.Api.Services.Interfaces
{
    public interface IPropertyService
    {
        Task<IEnumerable<PropertyDto>> GetFilteredProperties(PropertyFilterDto filter);
    }
}
