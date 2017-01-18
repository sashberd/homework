using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Map.Google
{
    public class GooglePolylines : List<GooglePolylines>
    {
        public GooglePolylines()
        {
        }

        //public static GooglePolyLines CloneMe(GooglePolyLines prev)
        //{
        //    GooglePolyLines p = new GooglePolyLines();
        //    for (int i = 0; i <= prev.Count - 1; i++)
        //    {
        //        GooglePolyline GPL = new GooglePolyline();
        //        GPL.ColorCode = prev[i].ColorCode;
        //        GPL.Geodesic = prev[i].Geodesic;
        //        GPL.ID = prev[i].ID;
        //        GPL.Points = GooglePoints.CloneMe(prev[i].Points);
        //        GPL.Width = prev[i].Width;
        //        p.Add(GPL);
        //    }
        //    return p;
        //}
      
       
        //public void Remove(int pIndex)
        //{
        //    this.RemoveAt(pIndex);
        //}
        //public void Remove(string pID)
        //{
        //    for (int i = 0; i <= Count - 1; i++)
        //    {
        //        if (this[i].ID == pID)
        //        {
        //            this.List.RemoveAt(i);
        //            return;
        //        }
        //    }
        //}

       

      
    }
}