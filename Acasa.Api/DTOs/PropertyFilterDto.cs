namespace Acasa.Api.DTOs
{
    public class PropertyFilterDto
    {
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public int? Bedrooms { get; set; }
    }
}
