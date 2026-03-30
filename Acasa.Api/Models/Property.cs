using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Acasa.Api.Models
{
    public class Property
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;


        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int? CityId { get; set; }
        public City? City { get; set; }

        [Required]
        public string Address { get; set; } = string.Empty;

        public int Bedrooms { get; set; }
        public int Bathrooms { get; set; }
        public double SurfaceArea { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty; 

        [ForeignKey("UserId")]
        public virtual ApplicationUser User { get; set; } = null!;

        public virtual ICollection<PropertyImage> Images { get; set; } = new List<PropertyImage>();

        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

    }
}
