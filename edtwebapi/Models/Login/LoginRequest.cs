using EDT.WebAPI.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Login
{
    public class LoginRequest:CommonRequest
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public string CompanyName { get; set; }
    }
}