using Acasa.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Acasa.Api.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
            : base(options) { }

        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyImage> PropertyImages { get; set; }
        public DbSet<County> Counties { get; set; }
        public DbSet<City> Cities { get; set; }
    }
}
