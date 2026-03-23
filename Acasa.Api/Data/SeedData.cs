using Acasa.Api.Models;

namespace Acasa.Api.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            if (context.Counties.Any()) return; 

            var counties = new List<County>
        {
            new County { Name = "București" },
            new County { Name = "Cluj" },
            new County { Name = "Timiș" },
            new County { Name = "Iași" },
            new County { Name = "Constanța" }
        };

            context.Counties.AddRange(counties);
            context.SaveChanges();

            var cities = new List<City>
        {
            new City { Name = "București", CountyId = counties.First(c => c.Name == "București").Id },

            new City { Name = "Cluj-Napoca", CountyId = counties.First(c => c.Name == "Cluj").Id },
            new City { Name = "Turda", CountyId = counties.First(c => c.Name == "Cluj").Id },

            new City { Name = "Timișoara", CountyId = counties.First(c => c.Name == "Timiș").Id },

            new City { Name = "Iași", CountyId = counties.First(c => c.Name == "Iași").Id },

            new City { Name = "Constanța", CountyId = counties.First(c => c.Name == "Constanța").Id }
        };

            context.Cities.AddRange(cities);
            context.SaveChanges();
        }
    }
}
