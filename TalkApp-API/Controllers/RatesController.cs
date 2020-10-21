using System;
using System.Collections.Generic;
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
    [Route("api/users/{userId}/[controller]")]
    [ApiController]

    public class RatesController : ControllerBase
    {
        private readonly ITalkAppRepo _repo;
        private readonly IMapper _mapper;

        public RatesController(ITalkAppRepo repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}", Name = "GetRate")]
        public async Task<IActionResult> GetRate(int userId, int id)
        {
            var messageFromRepo = await _repo.GetRate(id);

            if (messageFromRepo == null)
                return NotFound();

            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetRates(int userId, [FromQuery] RateParams rateParams)
        {
            rateParams.UserId = userId;
            var rateFromRepo = await _repo.GetRates(rateParams);


            var rates = _mapper.Map<IEnumerable<RateForReturnDto>>(rateFromRepo);

            Response.AddPagination(rateFromRepo.CurrentPage, rateFromRepo.PageSize,
               rateFromRepo.TotalCount, rateFromRepo.TotalPages);

            return Ok(rates);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateRate(RateForCreationDto rateForCreationDto)
        {
            var userId = rateForCreationDto.SenderId;
            var rater = await _repo.GetUser(userId);

            var userDetails = _mapper.Map<UserForDetailedDto>(rater);

            rateForCreationDto.RaterUserName = rater.UserName;
            rateForCreationDto.RaterPhotoUrl = userDetails.PhotoUrl;



            var obj = _repo.GetAvgRates(rateForCreationDto.RecipientId, rateForCreationDto.Score);

            if (obj.Result.Avg == 0)
            {
                obj.Result.Avg = rateForCreationDto.Score;
            }

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var recipient = await _repo.GetUser(rateForCreationDto.RecipientId);

            if (userId == recipient.Id)
                return BadRequest("You can not rate on your own");

            if (recipient == null)
                return BadRequest("Could not find user");

            // if (_repo.IsRated(rater, recipient).Result)
            //     return BadRequest("You have already commented on this person");

            var rate = _mapper.Map<Rate>(rateForCreationDto);

            recipient.AvgRate = obj.Result.Avg;
            recipient.TotalNumOfRates = obj.Result.TotalNumOfRates;

            _repo.Add(rate);

            if (await _repo.SaveAll())
            {
                // _repo.Add(recipient);

                var rateToReturn = _mapper.Map<RateForReturnDto>(rate);

                var result = CreatedAtRoute("GetMessage",
                                    new { userId, id = rate.Id }, rateToReturn);
                return result;
            }

            throw new Exception("Creating the message failed on save");
        }

        [HttpDelete("{rateId}")]
        public async Task<IActionResult> DeleteRate(int rateId, int userId)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var rateFromRepo = await _repo.GetRate(rateId);

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