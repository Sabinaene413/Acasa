namespace Acasa.Api.Models
{
    public class County
    {
        public int Id { get; set; }
        public string Name { get; set; }  

        public ICollection<City> Cities { get; set; }
    }
}
