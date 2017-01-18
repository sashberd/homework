using EDT.WebAPI.Models.Refuels;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Web;

namespace EDT.WebAPI.Facade
{
    public static class Helper
    {
        private static readonly IDictionary<Type, ICollection<PropertyInfo>> _Properties =
            new Dictionary<Type, ICollection<PropertyInfo>>();

        private static readonly DateTime baseDate = Convert.ToDateTime("1899-12-30");

        /// <summary>
        /// Converts a DataTable to a list with generic objects
        /// </summary>
        /// <typeparam name="T">Generic object</typeparam>
        /// <param name="table">DataTable</param>
        /// <returns>List with generic objects</returns>
        public static IEnumerable<T> DataTableToList<T>(this DataTable table) where T : class, new()
        {
            try
            {
                var objType = typeof(T);
                ICollection<PropertyInfo> properties;

                lock (_Properties)
                {
                    if (!_Properties.TryGetValue(objType, out properties))
                    {
                        properties = objType.GetProperties().Where(property => property.CanWrite).ToList();
                        _Properties.Add(objType, properties);
                    }
                }

                var list = new List<T>(table.Rows.Count);

               // foreach (var row in table.AsEnumerable().Skip(1))
                foreach (var row in table.AsEnumerable())
                {
                    var obj = new T();

                    foreach (var prop in properties)
                    {
                        try
                        {
                            var propType = Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType;
                            var safeValue = row[prop.Name] == null ? null : Convert.ChangeType(row[prop.Name], propType);

                            prop.SetValue(obj, safeValue, null);
                        }
                        catch
                        {
                            // ignored
                        }
                    }

                    list.Add(obj);
                }

                return list;
            }
            catch
            {
                return Enumerable.Empty<T>();
            }
        }


        public static DateTime? convertTime(this DateTime? date)
        {
            //DateTime result = baseDate;
            if (date.HasValue /*&& (date.Value.ToShortTimeString() != "00:00:00" || date.Value.ToShortTimeString() != "00:00")*/)
            {
                date = baseDate.AddHours(date.Value.Hour).AddMinutes(date.Value.Minute).AddSeconds(date.Value.Second);
            }
            else
            {
                date = baseDate;
            }

            return date;

        }
        public static DateTime? convertDate(this DateTime? date)
        {
            DateTime result = baseDate; ;
            if (date.HasValue)
            {
                result = date.Value;
            }
            //return result;   
            return new DateTime(result.Year, result.Month, result.Day, 0, 0, 0);
            
        }

    }
}