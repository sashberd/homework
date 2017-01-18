using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Refuels
{
    public class RefuelSearchDataObjectRequest
    {

        //Convert.ToDateTime(DatePicker.SelectedDate, DateFormatInfo)
        public int companyID { get; set; }

        public string pumpID { get; set; }

        public long fuelingMethod { get; set; }

        public DateTime? startDate
        {
            get;
            set;
        }

        public DateTime? endDate
        {
            get;
            set;
        }

        public DateTime? startTime
        {
            get;
            set;
        }

        public DateTime? endTime
        {
            get;
            set;
        }

        public string tagID { get; set; }

        public string driverID { get; set; }        
    }
}