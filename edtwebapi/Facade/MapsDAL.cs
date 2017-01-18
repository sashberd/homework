using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Facade
{
    public static class MapsDAL
    {
        public static DataTable GetVehicleList(double dMinX, double dMinY, double dMaxX, double dMaxY, int iCompanyID, string sVehicleString, int iVehicleID)
        {

            SqlCommand oComm = new SqlCommand();
            SqlDataAdapter oDataAdap = new SqlDataAdapter();
            DataSet oDS = new DataSet();
            int iRecordCount = 0;

            SqlConnection _Connection = new SqlConnection();
            _Connection.ConnectionString = ConfigurationManager.AppSettings["EDTConnectionString"];
            _Connection.Open();


            //Set the command parameters
            oComm.Parameters.Add("@CompanyID", SqlDbType.Int, 4).Value = iCompanyID;
            oComm.Parameters.Add("@VehicleID", SqlDbType.Int, 4).Value = iVehicleID;
            oComm.Parameters.Add("@VehicleList", SqlDbType.VarChar).Value = sVehicleString;
            oComm.Parameters.Add("@MaxLongitude", SqlDbType.Decimal, 9).Value = dMaxX;
            oComm.Parameters.Add("@MinLongitude", SqlDbType.Decimal, 9).Value = dMinX;
            oComm.Parameters.Add("@MaxLatitude", SqlDbType.Decimal, 9).Value = dMaxY;
            oComm.Parameters.Add("@MinLatitude", SqlDbType.Decimal, 9).Value = dMinY;

            //Set the command properties
            oComm.CommandText = "SP_MAP_VEHICLE_LIST";
            oComm.CommandType = CommandType.StoredProcedure;
            oComm.CommandTimeout = 90;
            oComm.Connection = _Connection;

            //Read the SP
            oDataAdap.SelectCommand = oComm;
            //Fill the dataset
            iRecordCount = oDataAdap.Fill(oDS);

            return oDS.Tables[0];
        }
    }
}