using EDT.WebAPI.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Dashboard
{
    public class GetIdleTimeCurrentStatusRequest:CommonRequest
    {
        public string VehicleID { get; set; } 

        public int VehicleType { get; set; } 

        public int VehicleGroup { get; set; }

        public GetIdleTimeCurrentStatusRequest()
        {
            this.VehicleID = "-1";
            this.VehicleType = -1;
            this.VehicleGroup = -1;
        }
    }
}