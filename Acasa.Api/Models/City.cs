namespace Acasa.Api.Models
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }  

        public int CountyId { get; set; }
        public County County { get; set; }
    }
}
