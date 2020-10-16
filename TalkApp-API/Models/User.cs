using System;
using System.Collections.Generic;
using TalkApp_API.Models;

namespace TalkApp_API.Models
{
    public class User
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string LookingFor { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public virtual ICollection<Photo> Photos { get; set; }
        public virtual ICollection<Skill> Skills { get; set; }
        public ICollection<Like> Likers { get; set; }
        public ICollection<Like> Likees { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<Rate> Raters { get; set; }
        public ICollection<Rate> Ratees { get; set; }
        public float AvgRate { get; set; }
        public int TotalNumOfRates { get; set; }
        public ICollection<Language> Languages { get; set; }
        public bool IsTutor { get; set; }
    }
}