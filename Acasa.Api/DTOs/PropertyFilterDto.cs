namespace Acasa.Api.DTOs
{
    public class PropertyFilterDto
    {
        public int? CityId { get; set; }
        public int? CountyId { get; set; }

        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Bedrooms { get; set; }
    }
}
