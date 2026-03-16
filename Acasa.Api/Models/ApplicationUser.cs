using Microsoft.AspNetCore.Identity;

namespace Acasa.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}
