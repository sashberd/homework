app.factory('$security', function (localStorageService) {
   
    var _salt = 'ZEIlzDvKvRoXqJbyQxUQ', // Generated at https://www.random.org/strings
     _username = localStorageService.get('SecurityManager.username'),
     _key = localStorageService.get('SecurityManager.key'),
     _ip =null

    return {
        generate: function (username, password) {
            if (username && password) {
                // If the user is providing credentials, then create a new key.
                this.logout();
            }
            // Set the username.
            username = _username || username;
            // Set the key to a hash of the user's password + salt.
            key = _key || CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256([password, _salt].join(':'), _salt));
            // Set the client IP address.
            _ip = localStorageService.get('$clientData');
            ip = _ip[0].data || _ip[1];
            // Persist key pieces.
            if (username) {
                localStorageService.set('SecurityManager.username', username);
                localStorageService.set('SecurityManager.key', key);
            }
            // Get the (C# compatible) ticks to use as a timestamp. http://stackoverflow.com/a/7968483/2596404
            var ticks = ((new Date().getTime() * 10000) + 621355968000000000);
            // Construct the hash body by concatenating the username, ip, and userAgent.
            var message = [username, ip, navigator.userAgent.replace(/ \.NET.+;/, ''), ticks].join(':');
            // Hash the body, using the key.
            var hash = CryptoJS.HmacSHA256(message, key);
            // Base64-encode the hash to get the resulting token.
            var token = CryptoJS.enc.Base64.stringify(hash);
            // Include the username and timestamp on the end of the token, so the server can validate.
            var tokenId = [username, ticks].join(':');
            // Base64-encode the final resulting token.
            var tokenStr = CryptoJS.enc.Utf8.parse([token, tokenId].join(':'));
            return CryptoJS.enc.Base64.stringify(tokenStr);
        },
        logout: function () {
            _ip = null;
            localStorageService.remove('SecurityManager.username');
            _username = null;
            localStorageService.remove('SecurityManager.key');
            _key = null;
        },
    }

});