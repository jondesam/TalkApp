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
    }
}