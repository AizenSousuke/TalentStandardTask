using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<UserSkill> _userSkillRepository;
        IRepository<UserExperience> _userExperienceRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<UserSkill> userSkillRepository,
                              IRepository<UserExperience> userExperienceRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userSkillRepository = userSkillRepository;
            _userExperienceRepository = userExperienceRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        #region Nik Custom Code

        #region Experience
        public bool AddNewExperience(ExperienceViewModel experience)
        {
            //Your code here;
            // TODO: Add new experience in service
            try
            {
                _userExperienceRepository.Add(ExperienceFromViewModel(experience));
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }

        public async Task<bool> UpdateExperienceAsync(ExperienceViewModel experience)
        {
            //Your code here;
            // TODO: Update experience in service
            try
            {
                await _userExperienceRepository.Update(ExperienceFromViewModel(experience));
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }
        public async Task<bool> DeleteExperienceAsync(ExperienceViewModel experience)
        {
            //Your code here;
            // TODO: Delete experience in service
            try
            {
                UserExperience deletedUserExperience = ExperienceFromViewModel(experience);
                deletedUserExperience.IsDeleted = true;
                await _userExperienceRepository.Update(deletedUserExperience);
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }
        public async Task<List<ExperienceViewModel>> GetAllExperienceAsync()
        {
            //Your code here;
            try
            {
                IEnumerable<UserExperience> userExperience = await _userExperienceRepository.Get(experience => experience.UserId == _userAppContext.CurrentUserId);
                return userExperience.Where(l => l.IsDeleted == false).Select(x => ViewModelFromExperience(x)).ToList();
            }
            catch (Exception e)
            {
                return null;
                throw e;
            }
        }

        #endregion

        #region Skill
        public bool AddNewSkill(AddSkillViewModel skill)
        {
            //Your code here;
            // TODO: Add new skill in service
            try
            {
                _userSkillRepository.Add(SkillFromViewModel(skill));
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }

        public async Task<bool> UpdateSkillAsync(AddSkillViewModel skill)
        {
            //Your code here;
            // TODO: Update skill in service
            try
            {
                await _userSkillRepository.Update(SkillFromViewModel(skill));
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }
        public async Task<bool> DeleteSkillAsync(AddSkillViewModel skill)
        {
            //Your code here;
            // TODO: Delete skill in service
            try
            {
                UserSkill deletedUserSkill = SkillFromViewModel(skill);
                deletedUserSkill.IsDeleted = true;
                await _userSkillRepository.Update(deletedUserSkill);
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }
        public async Task<List<AddSkillViewModel>> GetAllSkillAsync()
        {
            //Your code here;
            try
            {
                IEnumerable<UserSkill> userSkill = await _userSkillRepository.Get(skill => skill.UserId == _userAppContext.CurrentUserId);
                return userSkill.Where(l => l.IsDeleted == false).Select(x => ViewModelFromSkill(x)).ToList();
            }
            catch (Exception e)
            {
                return null;
                throw e;
            }
        }
        #endregion

        #region Language
        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            // TODO: Add new language in service
            try
            {
                _userLanguageRepository.Add(LanguageFromViewModel(language));
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }

        // Nik Custom Code
        public async Task<bool> UpdateLanguageAsync(AddLanguageViewModel language)
        {
            //Your code here;
            // TODO: Update language in service
            try
            {
                await _userLanguageRepository.Update(LanguageFromViewModel(language));
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }
        public async Task<bool> DeleteLanguageAsync(AddLanguageViewModel language)
        {
            //Your code here;
            // TODO: Delete language in service
            try
            {
                UserLanguage deletedUserLanguage = LanguageFromViewModel(language);
                deletedUserLanguage.IsDeleted = true;
                await _userLanguageRepository.Update(deletedUserLanguage);
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
        }
        public async Task<List<AddLanguageViewModel>> GetAllLanguageAsync()
        {
            //Your code here;
            try
            {
                IEnumerable<UserLanguage> userLanguage = await _userLanguageRepository.Get(language => language.UserId == _userAppContext.CurrentUserId);
                return userLanguage.Where(l => l.IsDeleted == false).Select(x => ViewModelFromLanguage(x)).ToList(); 
            }
            catch (Exception e)
            {
                return null;
                throw e;
            }
        }
        #endregion
        #endregion

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;
            try
            {
                User profile = null;
                profile = (await _userRepository.GetByIdAsync(Id));

                var videoUrl = "";

                if (profile != null)
                {
                    videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                              ? ""
                              : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                    var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();
                    var certifications = profile.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
                    var languages = profile.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
                    //var experience = profile.Experience.Select(x => ViewModelFromLanguage(x)).ToList();

                    var result = new TalentProfileViewModel
                    {
                        Id = profile.Id,
                        Address = profile.Address,
                        Certifications = certifications,
                        CvName = profile.CvName,
                        Description = profile.Description,
                        //Education = profile.Education,
                        Email = profile.Email,
                        //Experience = profile.Experience;
                        Gender = profile.Gender,
                        FirstName = profile.FirstName,
                        MiddleName = profile.MiddleName,
                        LastName = profile.LastName,
                        Languages = languages,
                        IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                        JobSeekingStatus = profile.JobSeekingStatus,
                        LinkedAccounts = profile.LinkedAccounts,
                        MobilePhone = profile.MobilePhone,
                        Nationality = profile.Nationality,
                        Phone = profile.Phone,
                        Summary = profile.Summary,
                        VisaExpiryDate = profile.VisaExpiryDate,
                        VisaStatus = profile.VisaStatus,
                        Skills = skills,
                        ProfilePhoto = profile.ProfilePhoto,
                        ProfilePhotoUrl = profile.ProfilePhotoUrl,
                        VideoName = profile.VideoName,
                        VideoUrl = videoUrl,
                    };
                    return result;
                }

                return null;
            }
            catch (Exception e)
            {

                throw e;
            }
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            //Your code here;
            // TODO: Update method
            try
            {
                User existingUser = await _userRepository.GetByIdAsync(updaterId);
                existingUser.FirstName = model.FirstName;
                existingUser.LastName = model.LastName;
                existingUser.Email = model.Email;
                existingUser.Phone = model.Phone;
                existingUser.Address = model.Address;
                existingUser.Nationality = model.Nationality;

                List<UserLanguage> userLanguagesList = new List<UserLanguage>();
                if (model.Languages != null)
                {
                    model.Languages.ForEach(language =>
                    {
                        UserLanguage userLanguage = LanguageFromViewModel(language);
                        userLanguagesList.Add(userLanguage);
                    });

                    existingUser.Languages = userLanguagesList;
                }


                List<UserSkill> userSkillsList = new List<UserSkill>();
                if (model.Skills != null)
                {
                    model.Skills.ForEach(skill =>
                    {
                        UserSkill userSkill = SkillFromViewModel(skill);
                        userSkillsList.Add(userSkill);
                    });

                    existingUser.Skills = userSkillsList;
                }


                List<UserExperience> userExperiencesList = new List<UserExperience>();
                if (model.Experience != null)
                {
                    model.Experience.ForEach(experience =>
                    {
                        UserExperience userExperience = ExperienceFromViewModel(experience);
                        userExperiencesList.Add(userExperience);
                    });

                    existingUser.Experience = userExperiencesList;
                }

                existingUser.VisaStatus = model.VisaStatus;
                existingUser.VisaExpiryDate = model.VisaExpiryDate;
                existingUser.JobSeekingStatus = model.JobSeekingStatus;

                // Update
                await _userRepository.Update(existingUser);
                return true;
            }
            catch (Exception e)
            {
                return false;
                throw e;
            }
            //throw new NotImplementedException();
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill,
                CurrentUserId = skill.UserId,
            };
        }
        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name = language.Language,
                CurrentUserId = language.UserId,
            };
        }
        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End,
            };
        }

        // Nik custom code
        protected UserLanguage LanguageFromViewModel(AddLanguageViewModel model)
        {
            return new UserLanguage
            {
                Id = model.Id,
                UserId = model.CurrentUserId,
                Language = model.Name,
                LanguageLevel = model.Level,
                IsDeleted = false,
            };
        }

        // Nik custom code
        protected UserSkill SkillFromViewModel(AddSkillViewModel model)
        {
            return new UserSkill
            {
                Id = model.Id,
                UserId = model.CurrentUserId,
                Skill = model.Name,
                ExperienceLevel = model.Level,
                IsDeleted = false,
            };
        }

        // Nik custom code
        protected UserExperience ExperienceFromViewModel(ExperienceViewModel model)
        {
            return new UserExperience
            {
                Id = model.Id,
                UserId = _userAppContext.CurrentUserId,
                Company = model.Company,
                Position = model.Position,
                Responsibilities = model.Responsibilities,
                Start = model.Start,
                End = model.End,
                IsDeleted = false,
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName = certification.CertificationName,
                CertificationFrom = certification.CertificationFrom,
                CertificationYear = certification.CertificationYear,
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
