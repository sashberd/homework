using EDT.WebAPI.Models.Dashboard;
using EDT.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using EDT.WebAPI.Facade;

namespace EDT.WebAPI.Controllers
{
    public class DashboardController : ApiController
    {
        [HttpPost]
        [ActionName("GetIdleTimeCurrentStatus")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public GetIdleTimeCurrentStatusResponse GetIdleTimeCurrentStatus(GetIdleTimeCurrentStatusRequest request)
        {
            request.DecodeAuthToken();
            BLUser userData = new BLUser();
            userData = CachingLayer.GetCacheObjectByType(request.SID, userData.GetType());
            GetIdleTimeCurrentStatusResponse response = null;
            if (userData != null)
            {
                using (var dashboardUtils = new BLDashboards())
                {
                    request.VehicleGroup = request.VehicleGroup > 0 ? request.VehicleGroup : userData.VehicleNodeId;
                    WIDGET_IdleTimeCurrentStatusResult result = dashboardUtils.Widget_IdleTimeCurrentStatus(userData.CompanyId, request.VehicleGroup, request.VehicleID, request.VehicleType);
                    response = new GetIdleTimeCurrentStatusResponse()
                    {
                        NowSecondsData = result.IDLE_TIME_CURRENT_SECS.GetValueOrDefault(0),
                        TodaySecondsData = result.IDLE_TIME_TODAY_SECS.GetValueOrDefault(0),
                        WeekSecondsData = result.IDLE_TIME_THIS_WEEK_SECS.GetValueOrDefault(0),
                        MonthSecondsData = result.IDLE_TIME_THIS_MONTH_SECS.GetValueOrDefault(0)
                    };
                }

            }
            return response;
        }
        [HttpPost]
        [ActionName("GetIrrigationMotorData")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public GetIrrigationMotorDataResponse GetIrrigationMotorData(GetIrrigationMotorDataRequest request)
        {
            request.DecodeAuthToken();
            BLUser userData = new BLUser();
            userData = CachingLayer.GetCacheObjectByType(request.SID, userData.GetType());
            GetIrrigationMotorDataResponse response = null;
            if (userData != null)
            {
                using (var dashboardUtils = new BLDashboards())
                {
                    //response = new GetIrrigationMotorDataResponse()
                    //{
                    //    IrrigationMotorData = dashboardUtils.Widget_IrrigationMotor4NAR(
                    //    userData.CompanyId, 
                    //    request.DateFrom.convertDate().Value, 
                    //    request.DateTo.convertDate().Value,
                    //    request.TimeFrom.convertTime().Value, 
                    //    request.DateTo.convertTime().Value, 
                    //    request.VehicleID),
                    //    VolumeUnit = userData.Company.VolumeUnitText
                    //};
                    response = new GetIrrigationMotorDataResponse()
                    {
                        IrrigationMotorData = dashboardUtils.Widget_IrrigationMotor4NAR(
                        userData.CompanyId,
                        request.DateFrom,
                        request.DateTo,
                        request.DateFrom,
                        request.DateTo,
                        request.VehicleID),
                        VolumeUnit = userData.Company.VolumeUnitText
                    };
                }
            }
            return response;
        }
    }
}
