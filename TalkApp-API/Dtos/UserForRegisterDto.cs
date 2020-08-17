using System.ComponentModel.DataAnnotations;

namespace TalkApp_API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "Password must be between  4 and 10")]
        public string Password { get; set; }
    }
}