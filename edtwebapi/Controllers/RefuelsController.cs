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
using EDT.WebAPI.Models.Common;

namespace EDT.WebAPI.Controllers
{
    public class RefuelsController : ApiController
    {
        [HttpPost]
        [ActionName("GetUserPumps")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<PumpDataObject> getUserPumpsList(CommonRequest request)
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
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<TypesAndSourcesDataObject> getUserTypeAndSourcesList(CommonRequest request)
        {
            BLAspLookupTables typesAndSources = new BLAspLookupTables(BLAspLookupTables.TABLE_NAME_ASP_FUELING_METHOD);
            DataTable dtTable = typesAndSources.DataTable;
            List<TypesAndSourcesDataObject> typesAndSourceList = dtTable.DataTableToList<TypesAndSourcesDataObject>().ToList();
            //typesAndSourceList.Insert(0, new TypesAndSourcesDataObject() { PHRASE_ID = "-1", PHRASE_NAME = "Select type and source" });
            return typesAndSourceList;
        }
        [HttpPost]
        [ActionName("GetUserDrivers")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<DriverItemInfo> getGetUserDriversList(CommonRequest request)
        {
            BLCommon common = new BLCommon();
            List<DriverItemInfo> driversList = common.GetEmployeesList(5, 10290, true).ToList<DriverItemInfo>();
            return driversList;
        }
        [HttpPost]
        [ActionName("GetUserSearchTags")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<SearchTagDataObject> getUserSearchTagsList(CommonRequest request)
        {
            BLUtils utils = new BLUtils();
            return utils.GetCompanyVehicleTags(5, 10290, true, false).DataTableToList<SearchTagDataObject>();
        }


        [HttpPost]
        [ActionName("SearchRefuels")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<RefuelSearchDataObjectResponseRequest> searchRefuels([FromBody]RefuelSearchDataObjectRequest request)
        {
            BLRefuel refuelObject = new BLRefuel()
            {
                CompanyID = 5,
                PumpID = request.pumpID,
                FuelingMethod = request.fuelingMethod,
                RefuelStartDate = request.startDate.convertDate().Value,
                RefuelStartTime = request.startTime.convertTime().Value,
                RefuelEndDate = request.endDate.convertDate().Value,
                RefuelEndTime = request.endTime.convertTime().Value,
                TagID = request.tagID,
                DriverID = request.driverID
            };
            BLRefuels refuelsObject = new BLRefuels(5, refuelObject, 1);
            GlobalData.InsertSessionProperty(HttpContext.Current.Session.SessionID, typeof(BLRefuels), refuelsObject);
            return refuelsObject.DataTable.DataTableToList<RefuelSearchDataObjectResponseRequest>();
        }
        [HttpPost]
        [ActionName("GetUserFuelSuppliers")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<GenericLookupTableItemInfo> getUserFuelSuppliers(CommonRequest request)
        {
            BLLookupTable lookupTable = new BLLookupTable();
            return lookupTable.GetCompanyGenericTable(53, 5);
        }
        [HttpPut]
        [ActionName("UpdateRefuelRow")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public void updateRefuelRow([FromBody]RefuelSearchDataObjectResponseRequest request)
        {
            BLRefuels refuelsObject = GlobalData.GetSessionProperty(HttpContext.Current.Session.SessionID, typeof(BLRefuels));
            BLRefuel bl = refuelsObject.RefuelByIndex(request.Sequence);
            bl.ActualPayment = bl.ActualPayment == 0 ? -1 : bl.ActualPayment;
            bl.ChangeTime = DateTime.Now.ToUniversalTime();
            if (request.R_FUELING_METHOD == 2)
            {
                bl.DriverID = bl.TagID = "0000000000";
            }
            else
            {
                bl.DriverID = request.R_BB_DRIVER_ID;
                bl.TagID = request.R_TAG_ID;
            }
            bl.Odometer = request.R_VEHICLE_ODOMETER == 0 ? -1 : request.R_VEHICLE_ODOMETER;
            bl.EngineHours = request.R_ENGINE_HOURS;
            bl.Project = request.R_PROJECT;
            bl.RefuelStartDate_NEW = request.R_DATE.convertDate().Value;
            bl.RefuelStartTime_NEW = request.R_TIME.convertTime().Value;
            bl.StartCounter = request.R_START_COUNTER == 0 ? -1 : request.R_START_COUNTER;
            bl.EndCounter = request.R_END_COUNTER == 0 ? -1 : request.R_END_COUNTER;
            //bl.User=USERNAME
            bl.FuelingMethod = request.R_FUELING_METHOD;
            bl.PumpIDNew = request.R_BB_PUMP_ID;
            bl.FuelSupplierID = request.R_FUEL_SUPPLIER_ID;
            bl.SupplierInvoiceNumber = request.R_SUPPLIER_INVOICE_NUMBER == "" ? -1 : int.Parse(request.R_SUPPLIER_INVOICE_NUMBER);
            bl.ActualPayment = request.R_ACTUAL_PAYMENT == 0 ? -1 : request.R_ACTUAL_PAYMENT;
            bl.NewTotalCounter = request.R_TOTAL_COUNTER == 0 ? -1 : request.R_TOTAL_COUNTER;/*old logic to do*/
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
