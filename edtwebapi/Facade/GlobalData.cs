using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Facade
{
    public static class GlobalData
    {
        private static readonly object _syncRoot = new object();
        private static Dictionary<string, Dictionary<Type, dynamic>> _data;

        public static void InitSessionDictionary()
        {
            lock (_syncRoot)
            {
                if (_data == null)
                    _data = GenerateSessionDictionary();
            }
        }

        private static Dictionary<string, Dictionary<Type, dynamic>> GenerateSessionDictionary()
        {
            return new Dictionary<string, Dictionary<Type, dynamic>>();
        }

        public static void InsertSessionProperty(string sessionID, Type objectType, dynamic _object)
        {
            if (!_data.ContainsKey(sessionID))
            {
                _data.Add(sessionID, new Dictionary<Type, dynamic>());
            }
            if (!_data[sessionID].ContainsKey(objectType))
            {
                _data[sessionID].Add(objectType, _object);
            }
            else
            {
                _data[sessionID][objectType] = _object;
            }
        }
        public static dynamic GetSessionProperty(string sessionID, Type objectType)
        {
            return _data[sessionID][objectType];
        }
        public static bool IsSessionPropertyExists(string sessionID)
        {
            return _data.ContainsKey(sessionID);
        }

    }
}