using EDT.WebAPI.Cryptography;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Models.Common
{
    public class CommonRequest
    {
        /*RSA AuthToken*/
        public string T { get; set; }

        internal string SID { get; set; }

        internal void DecodeAuthToken()
        {
            var target = new CipherEngine();
            List<string> decriptedValue = target.Decrypt(this.T).Split(',').ToList();
            this.SID = decriptedValue.First();
        }

    }
}