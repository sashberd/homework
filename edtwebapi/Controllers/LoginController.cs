using EDT.WebAPI.Facade;
using EDT.WebAPI.Filters;
using EDT.WebAPI.Models.Login;
using EDT.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace EDT.WebAPI.Controllers
{
    public class LoginController : ApiController
    {
        [HttpPost]
        [ActionName("Login")]       
        [Filters.Authorize]        
        public LoginResponse Login([FromBody] LoginRequest request)
        {
            LoginResponse response = new LoginResponse();
            response.IsAuthorised = false;
            try
            {              
                BLUser user = new BLUser(request.Username, request.Password, request.CompanyName, Request.RequestUri.AbsolutePath);
                if (user != null)
                {
                    request.DecodeAuthToken();                  
                    CachingLayer.Insert<BLUser>(user, request.SID);
                    response.IsAuthorised = true;
                }
            }
            catch (ArgumentException ex) { }
            return response;
        }

    }
}
