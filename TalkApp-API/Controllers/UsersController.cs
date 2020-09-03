using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TalkApp_API.Data;

namespace TalkApp_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    { 
        private readonly ITalkAppRepo _repo;

        public UsersController(ITalkAppRepo repo)
        {
            this._repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {

            var users = await _repo.GetUsers();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);

            return Ok(user);
        }

    }
}