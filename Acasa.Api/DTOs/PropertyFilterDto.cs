namespace Acasa.Api.DTOs
{
    public class PropertyFilterDto
    {
        public int? CityId { get; set; }
        public int? CountyId { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }

        public double? MinSurfaceArea { get; set; }
        public double? MaxSurfaceArea { get; set; }

        public int? Bedrooms { get; set; }
        public int? Bathrooms { get; set; }
    }
}
