using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map
{
    public class VehicleMapInfo
    {
        public double VEHICLE_LONGITUDE { get; set; }

        public double VEHICLE_LATITUDE { get; set; }

        public long VEHICLE_ID { get; set; }

        public short VEHICLE_ANGLE { get; set; }

        public int VEHICLE_COLOR { get; set; }       

        public string VEHICLE_TOOL_TIP { get; set; }

        public string VEHICLE_LABEL { get; set; }

        public string VEHICLE_ICON { get; set; }

        public string VEHICLE_TYPE_IMAGE_FILENAME { get; set; }

        public int Vehicle_Online_Status { get; set; }
    }
}