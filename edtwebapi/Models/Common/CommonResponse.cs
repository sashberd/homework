using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Common
{
    public class CommonResponse
    {
        public int Status { get; set; }

        public string Reason { get; set; }

        public string ResponseStatus { get; set; }

        public string ResponseMessage { get; set; }
    }
}