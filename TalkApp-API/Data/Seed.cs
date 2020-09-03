
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using TalkApp_API.Data;
using TalkApp_API.Models;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(DataContext context)
        {
            if (!context.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");

                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                foreach (var user in users)
                {
                    byte[] passwordHash, passwrodSalt;
                    CreatePasswordHash("password", out passwordHash, out passwrodSalt);

                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwrodSalt;
                    user.UserName = user.UserName.ToLower();
                    context.Users.Add(user);

                }
                context.SaveChanges();
            }
        }


        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwrodSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwrodSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}