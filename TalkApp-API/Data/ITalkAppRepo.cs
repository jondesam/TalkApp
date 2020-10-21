using System.Collections.Generic;
using System.Threading.Tasks;
using TalkApp_API.Helpers;
using TalkApp_API.Models;

namespace TalkApp_API.Data
{
    public interface ITalkAppRepo
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(UserParams userParams);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetMainPhotoForUser(int userId);
        Task<Like> GetLike(int userId, int recipientId);
        Task<Message> GetMessage(int messageId);
        Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId);
        Task<IEnumerable<Message>> GetLastMessages(int userId);
        Task<PagedList<Rate>> GetRates(RateParams rateParams);
        Task<bool> IsRated(User rater, User ratee);
        Task<Rate> GetRate(int rateId);
        Task<AvgRates> GetAvgRates(int userId, int score);
        Task<Skill> GetSkill(int skillId);
        Task<Language> GetLang(int langId);
        Task<IEnumerable<Language>> GetLangs(int userId);
    }
}