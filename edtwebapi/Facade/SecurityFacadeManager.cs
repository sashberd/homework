using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;

namespace EDT.WebAPI.Facade
{
    public class SecurityFacadeManager
    {
        /// <summary>
        /// Token-based authentication for ASP .NET MVC REST web services.
        /// Copyright (c) 2015 Kory Becker
        /// http://primaryobjects.com/kory-becker
        /// License MIT
        /// </summary>

        public static string GetIP(HttpRequestMessage request)
        {
            IEnumerable<string> ip = new List<string>();
            request.Headers.TryGetValues("X-Forwarded-For", out ip); // AWS compatibility
            if (ip == null || string.IsNullOrEmpty(ip.ToList().FirstOrDefault()))
            {
                if (request.Properties.ContainsKey("MS_HttpContext"))
                {
                    return ((HttpContextWrapper)request.Properties["MS_HttpContext"]).Request.UserHostAddress;
                }
            }
            return ip.ToList().FirstOrDefault();
        }


    }
}