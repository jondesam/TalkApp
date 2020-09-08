using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
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
        public async Task<IEnumerable<User>> GetUsers()
        {
            var users = await _context.Users.Include(p => p.Photos).Include(p => p.Skills).ToListAsync();

            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}