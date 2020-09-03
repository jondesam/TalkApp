using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalkApp_API.Data;
using TalkApp_API.Dtos;

namespace TalkApp_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ITalkAppRepo _repo;
        // private readonly IMapper _mapper;

        public UsersController(ITalkAppRepo repo)
        {
            // this._mapper = mapper;
            this._repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {

            var users = await _repo.GetUsers();

            // var usersToReturn = _mapper.Map<IEnumerable<UserForDetailedDto>>(users);

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            // var userToReturn = _mapper.Map<UserForDetailedDto>(user);

            return Ok(user);
        }

    }
}