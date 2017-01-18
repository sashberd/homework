using EDT.WebAPI.Cryptography;
using EDT.WebAPI.Models.General;
using EDT.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Web;

namespace EDT.WebAPI.Facade
{
    public class AuthorizationFacade
    {
        public GATResponse GetAuthorizationToken(GATRequest p_Request, GATResponse p_Response)
        {
            try
            {
                if (string.IsNullOrEmpty(p_Request.IPAddress))
                {
                    p_Response.ResponseStatus = ((int)HttpStatusCode.BadRequest).ToString();
                    p_Response.ResponseMessage = "Missing IPAddress";
                }
                else
                {
                    var guid = Guid.NewGuid();
                    p_Response.T = this.GetAuthorizationToken(p_Request, guid);
                    //p_Response.A = ConfigurationManager.AppSettings["ApiKey"];
                    //p_Response.I = ConfigurationManager.AppSettings["AppID"];
                    //p_Response.SID = guid.ToString();
                    p_Response.ResponseStatus = ((int)HttpStatusCode.OK).ToString();
                }
            }
            catch (Exception e)
            {
                p_Response.ResponseStatus = ((int)HttpStatusCode.InternalServerError).ToString();
                p_Response.ResponseMessage = e.Message + e.StackTrace;
            }
            return p_Response;
        }

        private string GetAuthorizationToken(GATRequest p_Data,Guid p_Guid)
        {
            if (!CachingLayer.IPThrottle(p_Data.IPAddress)) {
                throw new AccessViolationException("Throtteling was defined");
            }
            var target = new CipherEngine();           
            //long p_SIDRandomNumber = new Random().Next(int.MinValue, int.MaxValue);
            string p_DataToEncrypt = string.Join(",", p_Guid, p_Data.CallingPage, ConfigurationManager.AppSettings["AppID"], p_Data.IPAddress,/* p_SIDRandomNumber,*/ DateTime.UtcNow.Ticks);
            string SIDKey = target.Encrypt(p_DataToEncrypt);
            CachingLayer.Insert(SIDKey, p_Guid.ToString());                       
            return SIDKey;
        }
    }
}