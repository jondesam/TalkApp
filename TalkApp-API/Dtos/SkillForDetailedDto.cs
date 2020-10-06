using System;

namespace TalkApp_API.Dtos
{
    public class SkillForDetailedDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string SkillName { get; set; }
        public string Description { get; set; }
        public string Url1 { get; set; }
        public string Url2 { get; set; }
        public string Url3 { get; set; }
    }
}