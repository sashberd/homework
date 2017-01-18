using EDT.WebAPI.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.General
{
    public class GATResponse:CommonResponse
    {
        //Auth TOKEN
        public string T { get; set; }
        //Api public key
        //public string A { get; set; }
        //Appication ID
        //public string I { get; set; }
      
    }
}