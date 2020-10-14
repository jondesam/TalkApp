namespace TalkApp_API.Dtos
{
    public class LanguageForDetailedDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string LangueSpeak { get; set; }
        public bool IsNative { get; set; }
    }
}