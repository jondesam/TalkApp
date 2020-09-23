using System;
using TalkApp_API.Models;

namespace TalkApp_API.Dtos
{
    public class RateForCreationDto
    {
        public int SenderId { get; set; }

        public int RecipientId { get; set; }

        public string Comment { get; set; }
        public int Score { get; set; }

        public DateTime RateMade { get; set; }
        public RateForCreationDto()
        {
            RateMade = DateTime.Now;
        }
        public string RaterUserName { get; set; }
        public string RaterPhotoUrl { get; set; }
    }
}