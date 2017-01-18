using EDT.WebAPI.Facade;
using EDT.WebAPI.Models.Common;
using EDT.WebAPI.Models.General;
using EDT.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Web.Http;

namespace EDT.WebAPI.Controllers
{
    public class GeneralController : ApiController
    {
        [HttpPost,HttpOptions]       
        [ActionName("GAT")]
        public GATResponse GetAuthorizationToken([FromBody]GATRequest request)
        {
            AuthorizationFacade authFacade = new AuthorizationFacade();
            GATResponse response = new GATResponse();

            /*using (var cryptoProvider = new RNGCryptoServiceProvider())
            {
                byte[] secretKeyByteArray = new byte[32]; //256 bit
                cryptoProvider.GetBytes(secretKeyByteArray);
                var APIKey = Convert.ToBase64String(secretKeyByteArray);
            }*/
            return authFacade.GetAuthorizationToken(request, response);
        }
        [HttpPost]        
        [ActionName("ECL")]
        public void ExtendCacheLifetime([FromBody]CommonRequest request)
        {
            request.DecodeAuthToken();
            List<dynamic> temp = null;
            if (CachingLayer.Exists(request.SID))
            {
                CachingLayer.Get<List<dynamic>>(request.SID, out temp);
                if (temp != null)
                {
                    CachingLayer.Clear(request.SID);
                    CachingLayer.Add<List<dynamic>>(temp, request.SID);
                }
            }
        }
    }
}
