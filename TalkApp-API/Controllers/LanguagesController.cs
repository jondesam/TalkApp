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
    public class LanguagesController : ControllerBase
    {
        private readonly ITalkAppRepo _repo;
        private readonly IMapper _mapper;

        public LanguagesController(ITalkAppRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetLang")]
        public async Task<IActionResult> GetLang(int userId, int id)
        {
            var messageFromRepo = await _repo.GetLang(id);

            if (messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpPost]
        public async Task<IActionResult> SaveLanguages(int userId, LanguageForDetailedDto languageForDetailedDto)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            languageForDetailedDto.UserId = userId;

            var language = _mapper.Map<Language>(languageForDetailedDto);

            _repo.Add(language);

            if (await _repo.SaveAll())
            {
                return NoContent();
            }

            throw new Exception($"Updating user {userId} failed on save");
        }


        [HttpDelete("{langId}")]
        public async Task<IActionResult> DeleteLang(int langId, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var rateFromRepo = await _repo.GetLang(langId);

            if (rateFromRepo == null)
            {
                return BadRequest("Could not find Review");
            }

            _repo.Delete(rateFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new Exception("Error deleting the message");
        }

    }
}