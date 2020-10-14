namespace TalkApp_API.Models
{
    public class Language
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string LangueSpeak { get; set; }
        public User User { get; set; }
        public bool IsNative { get; set; }
    }
}