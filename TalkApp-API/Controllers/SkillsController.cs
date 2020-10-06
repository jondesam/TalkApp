using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalkApp_API.Data;
using TalkApp_API.Dtos;
using TalkApp_API.Helpers;
using TalkApp_API.Models;

namespace TalkApp_API.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly ITalkAppRepo _repo;
        private readonly IMapper _mapper;

        public SkillsController(ITalkAppRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> AddSkill(int userId, SkillForDetailedDto skillForDetailedDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            skillForDetailedDto.UserId = userId;

            var skill = _mapper.Map<Skill>(skillForDetailedDto);

            _repo.Add(skill);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"Updating user {userId} failed on save");
        }

        [HttpDelete("{skillId}")]
        public async Task<IActionResult> DeleteSkill(int userId, int skillId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var skillFromRepo = await _repo.GetSkill(skillId);

            var skill = _mapper.Map<Skill>(skillFromRepo);

            _repo.Delete(skill);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"Deleting user {userId}'s skill failed");
        }

        [HttpGet("{id}", Name = "GetSkill")]
        public async Task<IActionResult> GetSkill(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var skillFromRepo = await _repo.GetSkill(id);

            if (skillFromRepo == null)
                return NotFound();

            return Ok(skillFromRepo);
        }
    }
}