using System;
using TalkApp_API.Models;

namespace TalkApp_API.Dtos
{
    public class RateForReturnDto
    {
        public int Id { get; set; }
        public int RaterId { get; set; }
        public int RateeId { get; set; }
        public string RaterUserName { get; set; }
        public string RaterPhotoUrl { get; set; }
        public string Comment { get; set; }
        public int Score { get; set; }
        public DateTime RateMade { get; set; }
    }
}