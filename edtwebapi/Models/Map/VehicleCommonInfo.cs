using System;

namespace EDT.WebAPI.Models.Map
{
    public class VehicleCommonInfo
    {
        public string DEVICE_TYPE_NUMBER { get; set; }
        public long DRIVER_ID { get; set; }
        public string DRIVER_NAME { get; set; }
        public int Event_Code { get; set; }
        public string EVENT_NAME { get; set; }
        public DateTime Event_Time { get; set; }
        public int FUEL_LEVEL_PCT { get; set; }
        public string GPS_STATUS { get; set; }
        public int GROUP_ID { get; set; }
        public string GROUP_NAME { get; set; }
        public int Heading { get; set; }
        public string IMAGE_FILENAME { get; set; }
        public string Immobilizer_State { get; set; }
        public int IS_CAMERA_IN_VEHICLE { get; set; }
        public float LATITUDE { get; set; }
        public string Location { get; set; }
        public float LONGITUDE { get; set; }
        public string NICK_NAME { get; set; }
        public float Odometer { get; set; }
        public int ONLINE_STATUS { get; set; }
        public string PHONE_NUMBER { get; set; }
        public string PLATE_NUMBER { get; set; }
        public int RPM { get; set; }
        public int Satellites { get; set; }
        public float Speed { get; set; }
        public int TRIP_TYPE { get; set; }
        public DateTime UpdateTime { get; set; }
        public string VEHICLE_BB_ID { get; set; }
        public int Vehicle_Color { get; set; }
        public long VEHICLE_ID { get; set; }
        public int VEHICLE_ONLINE_TYPE { get; set; }
        public int Vehicle_State { get; set; }
    }
}