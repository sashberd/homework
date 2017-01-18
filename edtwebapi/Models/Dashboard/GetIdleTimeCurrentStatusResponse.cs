using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Dashboard
{
    public class GetIdleTimeCurrentStatusResponse
    {
        public int NowSecondsData { get; set; }

        public int TodaySecondsData { get; set; }

        public int WeekSecondsData { get; set; }

        public int MonthSecondsData { get; set; }
    }
}