using System;
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
            var user = await _context.Users.Include(p => p.Photos).Include(p => p.Skills).Include(p => p.Raters).Include(p => p.Ratees).Include(p => p.Languages).FirstOrDefaultAsync(u => u.Id == id);

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
            var users = _context.Users.Include(p => p.Photos).Include(p => p.Skills).Include(p => p.Likers).Include(p => p.Likees)
            .Include(p => p.Raters).Include(p => p.Ratees).Include(p => p.Languages)
            .OrderByDescending(u => u.Created).AsQueryable();

            if (!userParams.IncludeStudents)
            {
                users = users.Where(user => user.IsTutor == true);
            }

            if (userParams.UserId > 0)
            {
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
            }


            if (!string.IsNullOrEmpty(userParams.Search))
            {
                users = users.Where(u => u.Skills.Any(s => s.SkillName.ToLower().Contains(userParams.Search.ToLower())));
            }

            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":

                        users = users.OrderByDescending(u => u.Created);
                        break;

                    case "mostReviewed":
                        users = users.OrderByDescending(u => u.Raters.Count());
                        break;

                    default:

                        users = users.OrderByDescending(u => u.AvgRate);
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

        public async Task<Message> GetMessage(int messageId)
        {
            return await _context.Messages.FirstOrDefaultAsync(m => m.Id == messageId);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages.
                Include(u => u.Sender).ThenInclude(p => p.Photos).
                Include(u => u.Recipient).ThenInclude(p => p.Photos)
                    .Where(m => m.RecipientId == userId && m.RecipientDeleted == false
                              && m.SenderId == recipientId
                              || m.RecipientId == recipientId && m.SenderId == userId
                              && m.SenderDeleted == false)
                          .OrderBy(m => m.MessageSent)
                          .ToListAsync();

            return messages;
        }

        public async Task<IEnumerable<Message>> GetLastMessages(int userId)
        {
            var messages = _context.Messages.Where(m => m.SenderId == userId || m.RecipientId == userId);

            HashSet<int> ids = new HashSet<int>();
            HashSet<Message> lastMessages = new HashSet<Message>();

            foreach (var message in messages)
            {
                ids.Add(message.RecipientId);
                ids.Add(message.SenderId);
            }

            foreach (var id in ids)
            {
                var messagesList = await GetMessageThread(userId, id);
                var meesaToReurn = messagesList.LastOrDefault();

                if (meesaToReurn != null)
                {
                    lastMessages.Add(meesaToReurn);
                }
            }

            return lastMessages.OrderByDescending(m => m.MessageSent); ;
        }

        public async Task<PagedList<Rate>> GetRates(RateParams rateParams)
        {
            var rates = _context.Rates.AsNoTracking()
                            .Include(u => u.Rater)
                            .ThenInclude(p => p.Photos).AsNoTracking()
                            .Include(u => u.Ratee)
                            .ThenInclude(p => p.Photos)
                            .AsNoTracking().Where(u => u.RecipientId == rateParams.UserId)
                            .AsQueryable();

            rates = rates.OrderByDescending(d => d.RateMade);

            return await PagedList<Rate>.CreateAsync(rates, rateParams.PageNumber, rateParams.PageSize);
        }

        public bool IsRated(User rater, User ratee)
        {
            var rates = _context.Rates.Where(r => r.SenderId == rater.Id).Where(r => r.RecipientId == ratee.Id);

            if (rates.Count() > 0)
            {
                return true;
            }

            return false;

        }

        public async Task<Rate> GetRate(int rateId)
        {
            return await _context.Rates.FirstOrDefaultAsync(m => m.Id == rateId);
        }

        public AvgRates GetAvgRates(int recipientId, int score)
        {
            var user = _context.Users.Include(u => u.Raters).Where(u => u.Id == recipientId);

            var previousSum = user.SelectMany(user => user.Raters).Sum(rater => (float)rater.Score);

            var sum = previousSum + score;

            var num = (user.Select(user => user.Raters.Count())).First() + 1;

            var avg = sum / num;


            return new AvgRates { Avg = avg, TotalNumOfRates = num };



        }

        public async Task<Skill> GetSkill(int skillId)
        {
            return await _context.Skills.FirstOrDefaultAsync(s => s.Id == skillId);
        }

        public async Task<Language> GetLang(int langId)
        {
            return await _context.Languages.FirstOrDefaultAsync(s => s.Id == langId);
        }

        public async Task<IEnumerable<Language>> GetLangs(int userId)
        {
            var Languages = await _context.Languages.Where(l => l.UserId == userId).ToListAsync();

            return Languages;
        }


    }
}