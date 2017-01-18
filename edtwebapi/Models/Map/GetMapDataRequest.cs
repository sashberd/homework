using EDT.WebAPI.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map
{
    public class GetMapDataRequest:CommonRequest
    {
        public string VehicleIDs { get; set; }        
    }
}