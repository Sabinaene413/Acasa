using Acasa.Api.Models;
using System.ComponentModel.DataAnnotations;

namespace Acasa.Api.DTOs
{
    public class PropertyCreateDto
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        public int? CityId { get; set; }

        [Required]
        public string Address { get; set; } = string.Empty;

        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public double SurfaceArea { get; set; }

        public List<IFormFile>? Images { get; set; }

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
