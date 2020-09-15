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
            var users = _context.Users.Include(p => p.Photos).Include(p => p.Skills).Include(p => p.Likers).Include(p => p.Likees).OrderByDescending(u => u.LastActive).AsQueryable();

            users = users.Where(user => user.Id != userParams.UserId);

            if (userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }

            if (userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if (!string.IsNullOrEmpty(userParams.Search))
            {
                users = users.Where(u => u.Skills.Any(s => s.SkillName.Contains(userParams.Search)));
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;

                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        private async Task<IEnumerable<int>> GetUserLikes(int currentUserId, bool likers)
        {
            var user = await _context.Users
                           .Include(u => u.Likers)
                           .Include(u => u.Likees)
                           .FirstOrDefaultAsync(u => u.Id == currentUserId);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == currentUserId).Select(i => i.LikerId);
            }
            else
            {
                return user.Likees.Where(u => u.LikerId == currentUserId).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u =>
                u.LikerId == userId && u.LikeeId == recipientId);
        }
    }
}