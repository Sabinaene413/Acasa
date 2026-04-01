namespace Acasa.Api.Models
{
    public class SavedSearch
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;
        public string Name { get; set; } = string.Empty;
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinSurfaceArea { get; set; }
        public decimal? MaxSurfaceArea { get; set; }
        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
        public int? CityId { get; set; }
        public int? CountyId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
