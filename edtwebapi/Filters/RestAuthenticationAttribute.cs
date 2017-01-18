using EDT.WebAPI.Cryptography;
using EDT.WebAPI.Facade;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;


namespace EDT.WebAPI.Filters
{

    public class RestAuthenticationAttribute : System.Web.Http.AuthorizeAttribute
    {
        private const string _securityToken = "TN"; // Name of the url parameter.
        public override void OnAuthorization(HttpActionContext filterContext)
        {
            if (Authorize(filterContext))
            {
                return;
            }
            HandleUnauthorizedRequest(filterContext);
        }
        protected override void HandleUnauthorizedRequest(HttpActionContext filterContext)
        {
            base.HandleUnauthorizedRequest(filterContext);
        }
        private bool Authorize(HttpActionContext actionContext)
        {
            try
            {
                var request = actionContext.Request.Content.ReadAsStreamAsync().Result;
                string rawRequest;
                using (var stream = new StreamReader(actionContext.Request.Content.ReadAsStreamAsync().Result))
                {
                    stream.BaseStream.Position = 0;
                    rawRequest = stream.ReadToEnd();

                }
                dynamic header = JsonConvert.DeserializeObject(rawRequest);
                /*string token = request.Params[_securityToken];*/
                CipherEngine crypto= new CipherEngine();
                var temp=crypto.Decrypt(header.T.Value).Split(',');
                string ip = temp [3]?? SecurityFacadeManager.GetIP(actionContext.Request);
                return SecurityFacade.IsTokenValid(header.TN.Value, ip, header.UA.Value);

            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}