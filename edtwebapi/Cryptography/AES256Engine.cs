using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace EDT.WebAPI.Cryptography
{
    public class AES256Engine : IDisposable
    {
        private RijndaelManaged aesEncryption;
        public AES256Engine(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                Trace.WriteLine("AES256EngineCryptography error: key is null or empty.");
                throw new ArgumentNullException("key is null or empty.");
            }

            if (key.Length != 16)
            {
                Trace.WriteLine("AES256EngineCryptography error: the length of the key must be 16 characters.");
                throw new ArgumentException("The length of the key must be 16 characters.");
            }
            aesEncryption = new RijndaelManaged();
            aesEncryption.KeySize = 256; // 192, 256
            aesEncryption.BlockSize = 128;
            aesEncryption.Mode = CipherMode.CBC;
            aesEncryption.Padding = PaddingMode.PKCS7;

            byte[] ivArr = new byte[16] { 1, 3, 5, 7, 9, 11, 15, 17, 22, 25, 23, 27, 33, 23, 74, 75 };
            byte[] keyArr = ASCIIEncoding.UTF8.GetBytes(key);
            aesEncryption.IV = ivArr;
            aesEncryption.Key = keyArr;
        }

        public string Encrypt(string textToEncrypt)
        {
            ICryptoTransform crypto = aesEncryption.CreateEncryptor();
            byte[] plainText = ASCIIEncoding.UTF8.GetBytes(textToEncrypt);
            byte[] cipherText = crypto.TransformFinalBlock(plainText, 0, plainText.Length);
            return Convert.ToBase64String(cipherText);
        }

        public string Decrypt(string textToDecrypt)
        {
            ICryptoTransform decrypto = aesEncryption.CreateDecryptor();
            byte[] cipherText = Convert.FromBase64String(textToDecrypt);
            byte[] decryptedText = decrypto.TransformFinalBlock(cipherText, 0, cipherText.Length);
            return ASCIIEncoding.UTF8.GetString(decryptedText);
        }

        public void Dispose()
        {
            if (aesEncryption != null)
            {
                aesEncryption.Clear();
            }
        }
    }
}