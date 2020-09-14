using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TalkApp_API.Helpers;
using TalkApp_API.Models;

namespace TalkApp_API.Data
{
    public class TalkAppRepo : ITalkAppRepo
    {
        private DataContext _context;

        public TalkAppRepo(DataContext context)
        {
            this._context = context;

        }
        public void Add<T>(T entity) where T : class
        {

            _context.Add(entity);

        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).Include(p => p.Skills).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }
        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            // Same as below
            // await _context.Photos.FirstOrDefaultAsync(u => u.UserId == userId && u.IsMain);
            return await _context.Photos.Where(u => u.UserId == userId).
            FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).Include(p => p.Skills);

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}