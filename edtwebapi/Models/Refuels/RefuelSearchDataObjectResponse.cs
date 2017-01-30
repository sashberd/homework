using EDT.WebAPI.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Refuels
{
    public class RefuelSearchDataObjectResponseRequest:CommonRequest
    {
        public string DRIVER_NAME { get; set; }

        public int E_ID { get; set; }

        public string FUEL_SUPPLIER { get; set; }

        public string PUMP_NAME { get; set; }

        public decimal R_ACTUAL_PAYMENT { get; set; }

        public string R_BB_DRIVER_ID { get; set; }

        public string R_BB_PUMP_ID { get; set; }

        public string R_CHANGE_BY_USER { get; set; }

        public DateTime R_CHANGE_TIME { get; set; }

        public int R_COMPANY_ID { get; set; }

        public DateTime? R_DATE { get; set; }

        public decimal R_END_COUNTER { get; set; }

        public DateTime R_END_DATE { get; set; }

        public DateTime R_END_TIME { get; set; }

        public int R_ENGINE_HOURS { get; set; }

        public int R_FUEL_SUPPLIER_ID { get; set; }

        public int R_FUELING_METHOD { get; set; }

        public string R_FUELING_METHOD_NAME { get; set; }

        public string R_PROJECT { get; set; }

        public decimal R_START_COUNTER { get; set; }

        public string R_SUPPLIER_INVOICE_NUMBER { get; set; }

        public string  R_TAG_ID { get; set; }

        public DateTime? R_TIME { get; set; }

        public int R_TOTAL_COUNTER { get; set; }

        public int R_VEHICLE_ODOMETER { get; set; }

        public string VEHICLE_NAME { get; set; }

        public int Sequence { get; set; }
    }
}