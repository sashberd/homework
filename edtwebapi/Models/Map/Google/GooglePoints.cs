using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map.Google
{
    public class GooglePoints : List<GooglePoints>
    {
        //    public GooglePoints()
        //{
        //}

        //public static GooglePoints CloneMe(GooglePoints prev)
        //{
        //    GooglePoints p = new GooglePoints();
        //    for (int i = 0; i <= prev.Count - 1; i++) {
        //        p.Add(new GooglePoint(prev[i].ID, prev[i].Latitude, prev[i].Longitude, prev[i].IconImage, prev[i].InfoHTML1, prev[i].InfoHTML2, prev[i].Heading, prev[i].ToolTip, prev[i].Draggable));
        //    }
        //    return p;
        //}
       

        public override bool Equals(object obj)
        {
            // If parameter is null return false. 
            if (obj == null)
            {
                return false;
            }

            // If parameter cannot be cast to Point return false. 
            GooglePoints p = obj as GooglePoints;
            if ((object)p == null)
            {
                return false;
            }

            if (p.Count != Count)
            {
                return false;
            }


            for (int i = 0; i <= p.Count - 1; i++)
            {
                if (!this[i].Equals(p[i]))
                {
                    return false;
                }
            }
            // Return true if the fields match: 
            return true;
        }
      
    }
}
