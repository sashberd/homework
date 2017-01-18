using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map.Google
{
    public class GooglePolyline
    {
        //N-New, D-Deleted, C-Changed, ''-No Action 
        internal string LineStatus { get; set; }
        internal string ID { get; set; }
        internal GooglePoints Points { get; set; }
        internal string ColorCode { get; set; }
        internal bool Geodesic { get; set; }
        internal int Width { get; set; }


        public GooglePolyline()
        {
            this.Width = 10;
        }

        public override bool Equals(object obj)
        {
            // If parameter is null return false. 
            if (obj == null)
            {
                return false;
            }

            // If parameter cannot be cast to Point return false. 
            GooglePolyline p = obj as GooglePolyline;
            if ((object)p == null)
            {
                return false;
            }

            // Return true if the fields match: 
            return (Geodesic == p.Geodesic) && (Width == p.Width) && (p.ID == ID) && (p.ColorCode == ColorCode) && (p.Points.Equals(Points));
        }
    }
}