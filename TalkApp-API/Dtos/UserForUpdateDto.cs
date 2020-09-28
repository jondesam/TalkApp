using System.Collections.Generic;
using TalkApp_API.Models;

namespace TalkApp_API.Dtos
{
    public class UserForUpdateDto
    {
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public ICollection<Skill> Skills { get; set; }
        public float AvgRate { get; set; }

    }
}