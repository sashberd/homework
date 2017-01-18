using EDT.WebAPI.Models.Refuels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;
using EDT.WebAPI.Facade;
using System.Web;
using System.Web.SessionState;

namespace EDT.WebAPI.Controllers
{
    public class RefuelsController : ApiController
    {
        [HttpPost]
        [ActionName("GetUserPumps")]
        public IEnumerable<PumpDataObject> getUserPumpsList()
        {
            BLUtils utils = new BLUtils();
            List<PumpDataObject> listOfPumps = new List<PumpDataObject>();
            DataTable dtTable = utils.GetPumpsBB(5);
            List<PumpDataObject> pumpDataList = dtTable.DataTableToList<PumpDataObject>().ToList();
            //pumpDataList.Insert(0, new PumpDataObject() { ID = "-1", LIST_ITEM_DISPLAY_NAME_ID = "Select pump" });
            return pumpDataList;
        }

        [HttpPost]
        [ActionName("GetUserTypeAndSources")]
        public IEnumerable<TypesAndSourcesDataObject> getUserTypeAndSourcesList()
        {
            BLAspLookupTables typesAndSources = new BLAspLookupTables(BLAspLookupTables.TABLE_NAME_ASP_FUELING_METHOD);
            DataTable dtTable = typesAndSources.DataTable;
            List<TypesAndSourcesDataObject> typesAndSourceList = dtTable.DataTableToList<TypesAndSourcesDataObject>().ToList();
            typesAndSourceList.Insert(0, new TypesAndSourcesDataObject() { PHRASE_ID = "-1", PHRASE_NAME = "Select type and source" });
            return typesAndSourceList;
        }
        [HttpPost]
        [ActionName("GetUserDrivers")]
        public IEnumerable<DriverItemInfo> getGetUserDriversList()
        {
            BLCommon common = new BLCommon();
            List<DriverItemInfo> driversList = common.GetEmployeesList(5, 10290, true).ToList<DriverItemInfo>();
            return driversList;
        }
        [HttpPost]
        [ActionName("GetUserSearchTags")]
        public IEnumerable<SearchTagDataObject> getUserSearchTagsList()
        {
            BLUtils utils = new BLUtils();
            return utils.GetCompanyVehicleTags(5, 10290, true, false).DataTableToList<SearchTagDataObject>();
        }


        [HttpPost]
        [ActionName("SearchRefuels")]
        public IEnumerable<RefuelSearchDataObjectResponseRequest> searchRefuels([FromBody]RefuelSearchDataObjectRequest refuelSearchData)
        {
            BLRefuel refuelObject = new BLRefuel()
            {
                CompanyID = 5,
                PumpID = refuelSearchData.pumpID,
                FuelingMethod = refuelSearchData.fuelingMethod,
                RefuelStartDate = refuelSearchData.startDate.convertDate().Value,
                RefuelStartTime = refuelSearchData.startTime.convertTime().Value,
                RefuelEndDate = refuelSearchData.endDate.convertDate().Value,
                RefuelEndTime = refuelSearchData.endTime.convertTime().Value,
                TagID = refuelSearchData.tagID,
                DriverID = refuelSearchData.driverID
            };
            BLRefuels refuelsObject = new BLRefuels(5, refuelObject, 1);
            GlobalData.InsertSessionProperty(HttpContext.Current.Session.SessionID, typeof(BLRefuels), refuelsObject);
            return refuelsObject.DataTable.DataTableToList<RefuelSearchDataObjectResponseRequest>();
        }
        [HttpPost]
        [ActionName("GetUserFuelSuppliers")]
        public IEnumerable<GenericLookupTableItemInfo> getUserFuelSuppliers()
        {
            BLLookupTable lookupTable = new BLLookupTable();
            return lookupTable.GetCompanyGenericTable(53, 5);
        }
        [HttpPut]
        [ActionName("UpdateRefuelRow")]
        public void updateRefuelRow([FromBody]RefuelSearchDataObjectResponseRequest refuelUpdateData)
        {
            BLRefuels refuelsObject = GlobalData.GetSessionProperty(HttpContext.Current.Session.SessionID, typeof(BLRefuels));
            BLRefuel bl = refuelsObject.RefuelByIndex(refuelUpdateData.Sequence);
            bl.ActualPayment = bl.ActualPayment == 0 ? -1 : bl.ActualPayment;
            bl.ChangeTime = DateTime.Now.ToUniversalTime();
            if (refuelUpdateData.R_FUELING_METHOD == 2)
            {
                bl.DriverID = bl.TagID = "0000000000";
            }
            else
            {
                bl.DriverID = refuelUpdateData.R_BB_DRIVER_ID;
                bl.TagID = refuelUpdateData.R_TAG_ID;
            }
            bl.Odometer = refuelUpdateData.R_VEHICLE_ODOMETER == 0 ? -1 : refuelUpdateData.R_VEHICLE_ODOMETER;
            bl.EngineHours = refuelUpdateData.R_ENGINE_HOURS;
            bl.Project = refuelUpdateData.R_PROJECT;
            bl.RefuelStartDate_NEW = refuelUpdateData.R_DATE.convertDate().Value;
            bl.RefuelStartTime_NEW = refuelUpdateData.R_TIME.convertTime().Value;
            bl.StartCounter = refuelUpdateData.R_START_COUNTER == 0 ? -1 : refuelUpdateData.R_START_COUNTER;
            bl.EndCounter = refuelUpdateData.R_END_COUNTER == 0 ? -1 : refuelUpdateData.R_END_COUNTER;
            //bl.User=USERNAME
            bl.FuelingMethod = refuelUpdateData.R_FUELING_METHOD;
            bl.PumpIDNew = refuelUpdateData.R_BB_PUMP_ID;
            bl.FuelSupplierID = refuelUpdateData.R_FUEL_SUPPLIER_ID;
            bl.SupplierInvoiceNumber = refuelUpdateData.R_SUPPLIER_INVOICE_NUMBER == "" ? -1 : int.Parse(refuelUpdateData.R_SUPPLIER_INVOICE_NUMBER);
            bl.ActualPayment = refuelUpdateData.R_ACTUAL_PAYMENT == 0 ? -1 : refuelUpdateData.R_ACTUAL_PAYMENT;
            bl.NewTotalCounter = refuelUpdateData.R_TOTAL_COUNTER == 0 ? -1 : refuelUpdateData.R_TOTAL_COUNTER;/*old logic to do*/
            try
            {
                refuelsObject.Save();
            }
            catch (Exception e)
            {

            }

        }
    }
}
