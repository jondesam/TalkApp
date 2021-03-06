using System;

namespace TalkApp_API.Dtos
{
    public class UserForReturnDto
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
        public bool IsTutor { get; set; }

    }
}