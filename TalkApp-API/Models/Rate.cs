using System;

namespace TalkApp_API.Models
{
    public class Rate
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public virtual User Rater { get; set; }
        public int RecipientId { get; set; }
        public virtual User Ratee { get; set; }
        public string Comment { get; set; }
        public int Score { get; set; }
        public DateTime RateMade { get; set; }
        public string RaterUserName { get; set; }
        public string RaterPhotoUrl { get; set; }

    }
}