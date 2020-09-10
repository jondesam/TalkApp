using System;
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
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public UserForRegisterDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
} 