using EDT.WebAPI.Models.Map;
using EDT.WebAPI.Models.Map.Google;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Facade
{
    public class GetMapDataFacade
    {
        internal void createMapDataObject(ref GoogleObject GObj, List<VehicleMapInfo> list)
        {
            foreach (VehicleMapInfo info in list)
            {
                EDT.WebAPI.Models.Map.Google.GooglePoint point = new EDT.WebAPI.Models.Map.Google.GooglePoint();
                point.ToolTip = info.VEHICLE_LABEL;
                point.ID = info.VEHICLE_ID.ToString();
                point.Latitude = info.VEHICLE_LATITUDE;
                point.Longitude = info.VEHICLE_LONGITUDE;
                point.IconImage = info.VEHICLE_TYPE_IMAGE_FILENAME.Split('.').First() + "/" + info.Vehicle_Online_Status;
                point.Heading = info.VEHICLE_ANGLE;
                string temp1 = point.InfoHTML1;
                string temp2 = point.InfoHTML2;
                this.ParseCarsInfo(point, info.VEHICLE_TOOL_TIP);
                GObj.Points.Add(point);
            }
        }
        private void ParseCarsInfo(EDT.WebAPI.Models.Map.Google.GooglePoint point, string info)
        {
            try
            {
                string[] infoArray = info.Split('#');

                //0,3,9,8,4 (5 values)
                point.InfoHTML1 = infoArray[0] + "#" + infoArray[3] + "#" + infoArray[9] + "#" + infoArray[8] + "#" + infoArray[4];

                //1,2,5,6,10,11,12,15,13,14,7 (11 values)
                point.InfoHTML2 = infoArray[1] + "#" + infoArray[2] + "#" + infoArray[5] + "#" + infoArray[6] + "#" + infoArray[10] + "#" + infoArray[11] + "#" + infoArray[12] + "#" + infoArray[15] + "#" + infoArray[13] + "#" + infoArray[14] + "#" + infoArray[7];
            }
            catch
            {
                point.InfoHTML1 = "-=-#-=-#-=-#-=-#-=-";
                // 5 empty values
                point.InfoHTML1 = "-=-#-=-#-=-#-=-#-=-#-=-#-=-#-=-#-=-#-=-#-=-";
                // 11 empty values
            }

        }
    }
}