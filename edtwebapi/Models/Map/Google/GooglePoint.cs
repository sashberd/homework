using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map.Google
{
    public class GooglePoint
    {
        //N-New, D-Deleted, C-Changed, ''-No Action 
        internal string PointStatus { get; set; }
        internal string Address { get; set; }
        internal string ID { get; set; }
        internal string IconImage { get; set; }
        internal string IconShadowImage { get; set; }
        internal int IconImageWidth { get; set; }
        internal int IconShadowWidth { get; set; }
        internal int IconShadowHeight { get; set; }
        internal int IconAnchor_posX { get; set; }
        internal int IconAnchor_posY { get; set; }
        internal int InfoWindowAnchor_posX { get; set; }
        internal int InfoWindowAnchor_posY { get; set; }
        internal bool Draggable { get; set; }
        internal int IconImageHeight { get; set; }
        internal double Latitude { get; set; }
        internal double Longitude { get; set; }
        internal short Heading { get; set; }
        internal string InfoHTML1 { get; set; }
        internal string InfoHTML2 { get; set; }
        internal string ToolTip { get; set; }

        public GooglePoint()
        {
            this.IconImageWidth = 32;
            this.IconAnchor_posX = 16;
            this.IconAnchor_posY = 32;
            this.InfoWindowAnchor_posX = 16;
            this.InfoWindowAnchor_posY = 5;
            this.IconImageHeight = 32;
        }


        public GooglePoint(string pID, double plat, double plon, string picon, string pinfohtml1, string pinfohtml2, short pHeading)
        {
            ID = pID;
            Latitude = plat;
            Longitude = plon;
            IconImage = picon;
            InfoHTML1 = pinfohtml1;
            InfoHTML2 = pinfohtml2;
            Heading = pHeading;
        }

        public GooglePoint(string pID, double plat, double plon, string picon, string pinfohtml1, string pinfohtml2, short pHeading, string pTooltipText, bool pDraggable)
        {
            ID = pID;
            Latitude = plat;
            Longitude = plon;
            IconImage = picon;
            InfoHTML1 = pinfohtml1;
            InfoHTML2 = pinfohtml2;
            Heading = pHeading;
            ToolTip = pTooltipText;
            Draggable = pDraggable;
        }

        public GooglePoint(string pID, double plat, double plon, string picon)
        {
            ID = pID;
            Latitude = plat;
            Longitude = plon;
            IconImage = picon;
        }

        public GooglePoint(string pID, double plat, double plon)
        {
            ID = pID;
            Latitude = plat;
            Longitude = plon;
        }

        

        public override bool Equals(object obj)
        {
            // If parameter is null return false. 
            if (obj == null)
            {
                return false;
            }

            // If parameter cannot be cast to Point return false. 
            GooglePoint p = obj as GooglePoint;
            if ((object)p == null)
            {
                return false;
            }

            // Return true if the fields match: 
            return (Heading == p.Heading) && (InfoHTML1 == p.InfoHTML1) && (InfoHTML2 == p.InfoHTML2) && (IconImage == p.IconImage) && (p.ID == ID) && (p.Latitude == Latitude) && (p.Longitude == Longitude);
        }
    }
}