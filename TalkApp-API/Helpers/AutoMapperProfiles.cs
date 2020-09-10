using System.Linq;
using AutoMapper;
using TalkApp_API.Dtos;
using TalkApp_API.Models;

namespace TalkApp_API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserForReturnDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt =>
                     opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<Skill, SkillForDetailedDto>();

            CreateMap<UserForRegisterDto, User>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<UserForRegisterDto, User>();
        }

    }
}