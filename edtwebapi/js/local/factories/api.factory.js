app.factory('$api', function ($http, $commonUtils, localStorageService) {
    return {
        sendAPIRequest: function (controller, actionName, data, mehtod) {
            //var df = new DateFormat();
            return $http({
                url: $commonUtils.formatString($commonUtils.getBaseURL(/*local*/), controller, actionName),
                data: data || {},
                method: mehtod || 'POST',
                //headers: { 'Timestamp': df.formatDate($commonUtils.getUTCDateTime(), 'EE, MMM dd, yyyy hh:mm:ss a') },
               /* beforeSend: function () {
                    if (!this.url.toLowerCase().indexOf('gat') > -1 && localStorageService.get('$T')) {
                        var requestTimeStamp = (new Date() * 10000) + 621355968000000000;
                        var nounce = $commonUtils.generateQuickGuid();
                        // var temp = CryptoJS.MD5(JSON.stringify([localStorageService.get('$T').I, this.method, encodeURIComponent($commonUtils.getAbsoluteURL(location.href)), requestTimeStamp, nounce, CryptoJS.enc.Base64.stringify(objectHash.md5(this.data))].join().split("").map(function (x) { return x.charCodeAt(0); })));
                        var temp = [localStorageService.get('$T').I, this.method, encodeURIComponent($commonUtils.getAbsoluteURL(this.url.toLowerCase())).toLowerCase(), requestTimeStamp, nounce,  CryptoJS.enc.Base64.stringify(CryptoJS.MD5(Object.prototype.toString.call(this.data)))].join();//.split("").map(function (x) { return x.charCodeAt(0); });
                      
                        this.headers.Authorization = JSON.stringify({ scheme: 'amx', parameter: [localStorageService.get('$T').I, CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(temp, localStorageService.get('$T').A)), nounce, requestTimeStamp].join(':') })
                    }
                    //console.log(this.url)
                }*/
            });
        },
        sendRequest: function (url, method, data) {
            return $http({
                url: url,
                data: data || {},
                method: method || 'POST',

            });
        }

    }

});