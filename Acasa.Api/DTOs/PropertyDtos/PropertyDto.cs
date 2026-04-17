using Acasa.Api.Models;

namespace Acasa.Api.DTOs.PropertyDtos
{
    public class PropertyDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public City? City { get; set; } = null!;
        public string Address { get; set; } = string.Empty;
        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public double SurfaceArea { get; set; }
        public string UserId { get; set; } = string.Empty;
        public List<PropertyImageDto> Images { get; set; } = new();
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }

    public class PropertyImageDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
    }
}
