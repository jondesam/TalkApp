
using TalkApp_API.Models;
using Microsoft.EntityFrameworkCore;

namespace TalkApp_API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Skill> Skills { get; set; }


    }
}