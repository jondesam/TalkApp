using System;
using System.Collections.Generic;
using TalkApp_API.Models;

namespace TalkApp_API.Dtos
{
    public class UserForDetailedDto
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhotoUrl { get; set; }
        public ICollection<PhotoForDetailedDto> Photos { get; set; }
        public ICollection<SkillForDetailedDto> Skills { get; set; }
        // public ICollection<LikeForDetailedDto> Likers { get; set; }
        // public ICollection<LikeForDetailedDto> Likees { get; set; }
        // public ICollection<RateForCreationDto> Raters { get; set; }
        // public ICollection<RateForCreationDto> Ratees { get; set; }
        public float AvgRate { get; set; }
        public int TotalNumOfRates { get; set; }
        public ICollection<LanguageForDetailedDto> Languages { get; set; }


    }
}