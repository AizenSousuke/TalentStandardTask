using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Imgur.API.Authentication.Impl;
using Imgur.API.Endpoints.Impl;
using Imgur.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;
using Talent.Common.Models;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;
        private ImgurClient _imgurClient;
        private readonly string clientId = "bb9a76769ed64d0";

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            //Your code here;
            // TODO: File GET URL
            string fileName = "";

            if (id != null && type == FileType.ProfilePhoto)
            {
                //List<S3Object> objs = await _awsService.GetAllObjectFromS3("uploads");
                //S3Object obj = await _awsService.GetObjectFromName(fileName, "uploads");
                //fileName = obj.Key;
                // Imgur implementation
                _imgurClient = new ImgurClient(clientId);
                var endpoint = new ImageEndpoint(_imgurClient);
                return fileName;
            }
            
            return fileName;
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            //Your code here;
            // TODO: Save file
            string fileName = "";
            if (file != null && type == FileType.ProfilePhoto)
            {
                fileName = file.FileName + "-" + DateTime.UtcNow;
                Stream stream = file.OpenReadStream();
                //await _awsService.PutFileToS3(fileName, stream, "uploads");
                // Imgur implementation
                _imgurClient = new ImgurClient(clientId);
                var endpoint = new ImageEndpoint(_imgurClient);
                IImage image = await endpoint.UploadImageStreamAsync(stream);
                fileName = image.Link;
                return fileName;
            }

            return fileName;
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            //Your code here;
            // TODO: Delete file if it exists in the bucket
            if (id != null && type == FileType.ProfilePhoto)
            {
                //return await _awsService.RemoveFileFromS3(id, "uploads");
                // Imgur implementation
                _imgurClient = new ImgurClient(clientId);
                var endpoint = new ImageEndpoint(_imgurClient);
            }

            return false;
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
