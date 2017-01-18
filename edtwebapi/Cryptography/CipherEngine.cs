using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace EDT.WebAPI.Cryptography
{
    public class CipherEngine : IDisposable
    {
        AES256Engine aesEngine;
        private string _aesEncryptedKey;
        public CipherEngine()
        {
            var config = ConfigurationManager.AppSettings["AESKey"];//(CryptographySection)ConfigurationManager.GetSection("EDTCryptography");
            if (config == null)
            {
                Trace.WriteLine("AES256Engine section is not defined in the configuration file.");
                throw new Exception("AESKey is not defined in the configuration file.");
            }
            _aesEncryptedKey = config;
            InitAES(string.Empty);
        }

        public CipherEngine(string aesEncryptedKey, string rsaContainerName)
        {
            if (string.IsNullOrEmpty(aesEncryptedKey))
            {
                Trace.WriteLine("aesEncryptedKey is null or empty.");
                throw new ArgumentNullException("aesEncryptedKey is null or empty.");
            }
            _aesEncryptedKey = aesEncryptedKey;
            InitAES(rsaContainerName);
        }

        private void InitAES(string rsaContainerName)
        {
            try
            {
                string aesDescryptedKey;
                if (string.IsNullOrEmpty(rsaContainerName))
                {
                    using (var rsaEngine = new RSAEngine())
                    {
                        aesDescryptedKey = rsaEngine.Decrypt(_aesEncryptedKey);
                    }
                }
                else
                {
                    using (var rsaEngine = new RSAEngine(rsaContainerName))
                    {
                        aesDescryptedKey = rsaEngine.Decrypt(_aesEncryptedKey);
                    }
                }
                aesEngine = new AES256Engine(aesDescryptedKey);
            }
            catch (Exception ex)
            {
                Trace.WriteLine(string.Concat("AES256EngineCryptography error: ", ex.ToString()));
                throw;
            }
        }

        public string Encrypt(string data)
        {
            if (string.IsNullOrEmpty(data))
            {
                throw new ArgumentNullException("data is null or empty!");
            }

            return aesEngine.Encrypt(data);
        }

        public string Decrypt(string data)
        {
            string retValue = string.Empty;
            if (string.IsNullOrEmpty(data))
            {
                throw new ArgumentNullException("data is null or empty!");
            }

            try
            {
                retValue = aesEngine.Decrypt(data);
            }
            catch (Exception ex)
            {
                Trace.WriteLine(string.Concat("AES256EngineCryptography error: ", ex.ToString()));
                throw;
            }

            return retValue;
        }

        public void Dispose()
        {
            if (aesEngine != null)
            {
                aesEngine.Dispose();
            }
        }
    }
}
