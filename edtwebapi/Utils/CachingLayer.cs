using EDT.WebAPI.Cryptography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Utils
{
    public class CachingLayer
    {

        //private const string globalKey = "webapikey";
        private const int maxHitsPerMinute = 100;
        /// <summary>
        /// Insert value into the cache using
        /// appropriate name/value pairs
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="o">Item to be cached</param>
        /// <param name="key">Name of item</param>
        public static void Add<T>(T o, string key, int expiration = 20)
        {
            // NOTE: Apply expiration parameters as you see fit.
            // I typically pull from configuration file.

            // In this example, I want an absolute
            // timeout so changes will always be reflected
            // at that time. Hence, the NoSlidingExpiration.
            HttpContext.Current.Cache.Insert(
                key,
                o,
                null,
                DateTime.Now.AddMinutes(expiration),
                System.Web.Caching.Cache.NoSlidingExpiration);
        }

        /// <summary>
        /// Remove item from cache
        /// </summary>
        /// <param name="key">Name of cached item</param>
        public static void Clear(string key)
        {
            HttpContext.Current.Cache.Remove(key);
        }

        /// <summary>
        /// Check for item in cache
        /// </summary>
        /// <param name="key">Name of cached item</param>
        /// <returns></returns>
        public static bool Exists(string key)
        {
            return HttpContext.Current.Cache[key] != null;
        }

        /// <summary>
        /// Retrieve cached item
        /// </summary>
        /// <typeparam name="T">Type of cached item</typeparam>
        /// <param name="key">Name of cached item</param>
        /// <param name="value">Cached value. Default(T) if
        /// item doesn't exist.</param>
        /// <returns>Cached item as type</returns>
        public static bool Get<T>(string key, out T value)
        {
            try
            {
                if (!Exists(key))
                {
                    value = default(T);
                    return false;
                }

                value = (T)HttpContext.Current.Cache[key];
            }
            catch
            {
                value = default(T);
                return false;
            }

            return true;
        }

        public static void Insert<T>(T obj, string key)
        {
            List<dynamic> cacheList;
            if (Exists(key))
            {
                Get<List<dynamic>>(key, out cacheList);                
            }
            else
            {
                cacheList = new List<dynamic>();
            }
            cacheList.Add(obj);
            Add<List<dynamic>>(cacheList, key);
        }

        public static bool Authorize(string token)
        {
            bool isAuthorized = false;
            List<string> temp = Decrypt(token).Split(',').ToList();
            try
            {
                /* if (!Exists(""))
                 {
                     Add<string>(token, "");

                 }*/
                List<dynamic> apiData = null; ;
                Get<List<dynamic>>(temp.First(), out apiData);
                /*apiData.ForEach(item => 
                    {
                    string currentDecryptedAppID=Decrypt(item.AppID);
                    string currentDecryptedAppPassword = Decrypt(item.AppPassword);
                    if (string.Equals(currentDecryptedAppID, Decrypt(p_ID)) && string.Equals(currentDecryptedAppPassword, Decrypt(p_Pass)))
                        {
                        isAuthorized = true;
						
                        }



                    }, () => isAuthorized);*/
                //isAuthorized = IPThrottle(temp[3]);
                //isAuthorized = string.IsNullOrEmpty(apiData) ? false : true;
                isAuthorized = apiData!=null && IPThrottle(temp[3]);

            }
            catch (Exception e)
            {
                //Logger.LogWeb("Critical Exception was catched in Web api Authorization LAyer. The reason is: " + e.Message + e.StackTrace, TraceEventType.Error, AppConfig.AppID);

                //return isAuthorized;
            }

            return isAuthorized;
        }
        private static string Decrypt(string p_Value)
        {
            var target = new CipherEngine();
            string decriptedValue = target.Decrypt(p_Value);
            return decriptedValue;
        }

        public static bool IPThrottle(string p_IPAddress)
        {
            var hitsCount = 1;
            var result = false;
            if (Exists(p_IPAddress))
            {
                Get(p_IPAddress, out hitsCount);
                hitsCount++;
            }
            if (hitsCount <= maxHitsPerMinute)
            {
                Add(hitsCount, p_IPAddress, 1);
                result = true;
            }
            return result;
        }

        public static dynamic GetCacheObjectByType(string key, Type objectType)
        {
            dynamic obj = null;
            if (Exists(key))
            {
                List<dynamic> list;
                Get<List<dynamic>>(key, out list);
                obj = list.FirstOrDefault(item=>item.GetType()==objectType);
            }

            return obj;

        }
    }
   
}
/*internal static class MyExtensions
{
    public static void ForEach<T>(this IEnumerable<T> enumerable, Action<T> action, Func<bool> breakOn)
    {
        foreach (var item in enumerable)
        {
            action(item);
            if (breakOn())
            {
                break;
            }
        }
    }
}*/
