using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web;

namespace EDT.WebAPI.Cryptography
{
    public class RSAEngine : IDisposable
    {
        private RSACryptoServiceProvider m_rsaProvider;
        private string _rsaContainerName;

        public RSAEngine()
        {
            var config = ConfigurationManager.AppSettings["RSAContainerName"];//(CryptographySection)ConfigurationManager.GetSection("EDTCryptography");
            if (config == null)
            {
                //Trace.WriteLine("EDTCryptography error: EDTCryptography section is not defined in the configuration file.");
                throw new Exception("RSAContainerName is not defined in the configuration file.");
            }
            _rsaContainerName = config;
            InitContainer();
        }

        public RSAEngine(string rsaContainerName)
        {
            _rsaContainerName = rsaContainerName;
            InitContainer();
        }

        private void InitContainer()
        {
            CspParameters cspParams;
            const int PROVIDER_RSA_FULL = 1;
            cspParams = new CspParameters(PROVIDER_RSA_FULL);
            cspParams.KeyContainerName = _rsaContainerName;
            cspParams.Flags = CspProviderFlags.UseMachineKeyStore;
            cspParams.ProviderName = "Microsoft Strong Cryptographic Provider";
            m_rsaProvider = new RSACryptoServiceProvider(2048, cspParams);
        }

        public void AssignNewKey()
        {
            //provide public and private RSA params
            StreamWriter swWriter = new StreamWriter(@"keys.xml");
            string strPublicPrivateKeyXML = m_rsaProvider.ToXmlString(true);
            swWriter.Write(strPublicPrivateKeyXML);
            swWriter.Close();         
        }

        public string Encrypt(string strData2Encrypt)
        {
            //read plaintext, encrypt it to ciphertext
            byte[] baPlainbytes = System.Text.Encoding.UTF8.GetBytes(strData2Encrypt);
            byte[] baCipherbytes = m_rsaProvider.Encrypt(baPlainbytes, false);
            return Convert.ToBase64String(baCipherbytes);
        }

        public string Decrypt(string strData2Decrypt)
        {
            byte[] baGetPassword = Convert.FromBase64String(strData2Decrypt);

            //read ciphertext, decrypt it to plaintext
            byte[] baPlain = m_rsaProvider.Decrypt(baGetPassword, false);
            return System.Text.Encoding.UTF8.GetString(baPlain);
        }

        public void Dispose()
        {
            if (m_rsaProvider != null)
            {
                m_rsaProvider.Clear();
            }
        }
    }
}