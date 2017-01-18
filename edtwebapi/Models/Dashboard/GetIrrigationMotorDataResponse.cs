using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Dashboard
{
    public class GetIrrigationMotorDataResponse
    {
        public string VolumeUnit { get; set; }

        public List<WIDGET_IrrigationMotor4NARResult> IrrigationMotorData { get; set; }
    }
}