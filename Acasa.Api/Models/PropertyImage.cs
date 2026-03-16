using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Acasa.Api.Models
{
    public class PropertyImage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Url { get; set; } = string.Empty;

        public string PublicId { get; set; } = string.Empty;

        [Required]
        public int PropertyId { get; set; }

        [ForeignKey("PropertyId")]
        public virtual Property Property { get; set; } = null!;
    }
}
