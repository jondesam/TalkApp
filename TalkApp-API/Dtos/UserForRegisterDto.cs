using System.ComponentModel.DataAnnotations;

namespace TalkApp_API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 8, ErrorMessage = "Password must be between  8 and 10")]
        public string Password { get; set; }
    }
}