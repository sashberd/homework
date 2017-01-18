using EDT.WebAPI.Models.Common;
using EDT.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace EDT.WebAPI.Filters
{
    public class AuthorizeAttribute : ActionFilterAttribute
    {

        private readonly string T;
        public AuthorizeAttribute()
        {
            T = "T";
        }
        public override void OnActionExecuting(HttpActionContext actionContext)
        {

            var result = false;
            CommonRequest request=((CommonRequest)actionContext.ActionArguments["request"]);
            if (request!=null && !string.IsNullOrEmpty(request.T))
            {
                result=CachingLayer.Authorize(request.T);
            }

            if (!result)
            {
                var response = new HttpResponseMessage(HttpStatusCode.Unauthorized);
                actionContext.Response = response;
            }
        }
    }
}