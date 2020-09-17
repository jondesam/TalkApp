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
                .ForMember(dest => dest.PhotoUrl, src =>
                 src.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, src =>
                     src.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url));

            CreateMap<Photo, PhotoForDetailedDto>();
            CreateMap<Skill, SkillForDetailedDto>();
            CreateMap<Like, LikeForDetailedDto>();

            CreateMap<UserForRegisterDto, User>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto, Photo>();
            CreateMap<MessageForCreationDto, Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>()
                .ForMember(m => m.SenderPhotoUrl, src => src
                     .MapFrom(u => u.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
                .ForMember(m => m.RecipientPhotoUrl, src => src
                      .MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
        }

    }
};