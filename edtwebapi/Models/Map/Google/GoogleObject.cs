using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map.Google
{
    public class GoogleObject
    {
        internal List<GooglePoint> Points { get; set; }

        internal List<GooglePolyline> Polylines { get; set; }

        internal GooglePoint CenterPoint { get; set; }

        internal int ZoomLevel { get; set; }

        internal bool ShowZoomControl { get; set; }

        internal bool ShowOverviewMap { get; set; }

        internal bool AutomaticBoundaryAndZoom { get; set; }

        internal bool ShowTraffic { get; set; }

        internal bool ShowMapTypesControl { get; set; }

        internal string Width { get; set; }

        internal string Height { get; set; }

        internal string MapType { get; set; }

        internal string APIKey { get; set; }

        internal string Sensor { get; set; }

        internal string APIVersion { get; set; }

        public GoogleObject()
        {
            this.Width = "500px";
            this.Height = "400px";
            this.Sensor = "false";
            this.Points = new List<GooglePoint>();
            this.Polylines = new List<GooglePolyline>();
            this.CenterPoint = new GooglePoint();
        }


        public GoogleObject(GoogleObject prev)
        {
            //Points = GooglePoints.CloneMe(prev.Points);
            //Polylines = GooglePolyLines.CloneMe(prev.Polylines);            
            //ZoomLevel = prev.ZoomLevel;
            //ShowZoomControl = prev.ShowZoomControl;
            //ShowMapTypesControl = prev.ShowMapTypesControl;
            //ShowOverviewMap = prev.ShowOverviewMap;
            //Width = prev.Width;
            //Height = prev.Height;
            //MapType = prev.MapType;
            //APIKey = prev.APIKey;
            //ShowTraffic = prev.ShowTraffic;
            //SensorMap = prev.SensorMap;
            //AutomaticBoundaryAndZoom = prev.AutomaticBoundaryAndZoom;
        }
    }
}
