using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using TalkApp_API.Models;

namespace TalkApp_API.Data
{
    public class AuthRepo : IAuthRepo
    {
        private readonly DataContext _context;

        public AuthRepo(DataContext context)
        {
            this._context = context;

        }
        public async Task<User> Login(string username, string password)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(x => x.UserName == username);

            if (user == null)
                return null;

            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;
        }

        public async Task<User> Register(User user, string password)
        {
            byte[] passwordHash, passwrodSalt;

            CreatePasswordHash(password, out passwordHash, out passwrodSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwrodSalt;

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return user;
        }

        public async Task<bool> UserExists(string username)
        {
            if (await _context.Users.AnyAsync(x => x.UserName == username))
                return true;

            return false;
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwrodSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwrodSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {

                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i]) return false;
                }

            }
            return true;
        }
    }
}