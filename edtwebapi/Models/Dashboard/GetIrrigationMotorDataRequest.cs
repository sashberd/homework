using EDT.WebAPI.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Dashboard
{
    public class GetIrrigationMotorDataRequest : CommonRequest
    {
        public DateTime DateFrom { get; set; }

        public DateTime DateTo { get; set; }

        public DateTime TimeFrom { get; set; }

        public DateTime TimeTo { get; set; }

        public string VehicleID { get; set; }

    }
}