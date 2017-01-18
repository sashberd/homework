using EDT.WebAPI.Facade;
using EDT.WebAPI.Filters;
using EDT.WebAPI.Models.Map;
using EDT.WebAPI.Models.Map.Google;
using EDT.WebAPI.Utils;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace EDT.WebAPI.Controllers
{
    public class MapController : ApiController
    {
        [HttpPost]
        [ActionName("GetMapData")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]/*only with DB connection*/
        public IEnumerable<VehicleMapInfo> GetMapData(GetMapDataRequest request)
        {
            request.DecodeAuthToken();
            BLUser userData = new BLUser();
            //userData = GlobalData.GetSessionProperty(request.SID, userData.GetType());
            userData = CachingLayer.GetCacheObjectByType(request.SID, userData.GetType());
            IEnumerable<VehicleMapInfo> vehicleMapInfo = null;
            if (userData != null)
            {
                vehicleMapInfo = MapsDAL.GetVehicleList(-180, -90, 180, 90, userData.CompanyId, request.VehicleIDs, -1).DataTableToList<VehicleMapInfo>();
                GoogleObject GObj = new GoogleObject();
                GetMapDataFacade facade = new GetMapDataFacade();
                facade.createMapDataObject(ref GObj, vehicleMapInfo.ToList());

            }
            return vehicleMapInfo;
        }
        [HttpPost]
        [ActionName("GetUserVehiclesInfo")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<VehicleCommonInfo> GetUserVehiclesInfo(GetUserVehiclesInfoRequest request)
        {
            BLUser userData = new BLUser();
            request.DecodeAuthToken();
            IEnumerable<VehicleCommonInfo> vehicleInfoList = null;
            //userData = GlobalData.GetSessionProperty(request.SID, userData.GetType());
            userData = CachingLayer.GetCacheObjectByType(request.SID, userData.GetType());
            if (userData != null)
            {
                vehicleInfoList = userData.GetOnlineVehiclesInfo(false, string.Empty).Tables[0].DataTableToList<VehicleCommonInfo>();
            }
            return vehicleInfoList;
        }
        [HttpPost]
        [ActionName("GetUserGroupsData")]
        [Filters.Authorize]
        //[RestAuthenticationAttribute]
        public IEnumerable<GroupsDataInfo> GetGroupsData(GetUserGroupsDataRequest request)
        {
            BLUser userData = new BLUser();
            request.DecodeAuthToken();
            userData = CachingLayer.GetCacheObjectByType(request.SID, userData.GetType());
            VehicleTreeDS.VEHICLE_GROUPSRow temp = userData.GetVehicleGroupsDS().VEHICLE_GROUPS.FindByVTR_NODE_ID(userData.VehicleNodeId);
            List<GroupsDataInfo> groupsDataInfo = temp.Table.DataTableToList<GroupsDataInfo>().ToList();
            /*groupsDataInfo.Add(new GroupsDataInfo()
            { 
                VTR_COMPANY_ID=temp.VTR_COMPANY_ID,
                VTR_NODE_ID=temp.VTR_NODE_ID,
                VTR_NODE_NAME=temp.VTR_NODE_NAME
            });*/

            return groupsDataInfo;
        }

        

    }
}
