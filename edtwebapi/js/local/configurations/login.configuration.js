app.config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('login', {
        url: '/login',
        controller: 'loginController',
        controllerAs: 'loginCtrl',
        templateUrl: 'login.template.html',
        resolve: {
            $T: function ($clientData, $api, $commonUtils, localStorageService) {
                if (!localStorageService.get('$T')) {
                    var obj = {
                        ipaddress: $clientData[0].data || $clientData[1],
                        //sid:$commonUtils.generateQuickGuid(),
                        callingpage: location.href.split(location.host)[1].replace(/^\//, '')
                    }
                    return $api.sendAPIRequest('General', 'GAT', JSON.stringify(obj)).then(function (response) {

                        //$rootScope.$T=response.data;
                        return response.data
                    });
                }
            },
            $clientData: function ($api, $q) {
                var serviceIP = $api.sendRequest('https://api.ipify.org', 'GET');
                function findIP(onNewIP) { //  onNewIp - your listener function for new IPs
                    var promise = new Promise(function (resolve, reject) {
                        try {
                            var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection; //compatibility for firefox and chrome
                            var pc = new myPeerConnection({ iceServers: [] }),
                                noop = function () { },
                                localIPs = {},
                                ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
                                key;
                            function ipIterate(ip) {
                                if (!localIPs[ip]) resolve(ip)//onNewIP(ip);
                                localIPs[ip] = true;
                            }
                            pc.createDataChannel(""); //create a bogus data channel
                            pc.createOffer(function (sdp) {
                                sdp.sdp.split('\n').forEach(function (line) {
                                    if (line.indexOf('candidate') < 0) return;
                                    line.match(ipRegex).forEach(ipIterate);
                                });
                                pc.setLocalDescription(sdp, noop, noop);
                            }, noop); // create offer and set local description

                            pc.onicecandidate = function (ice) { //listen for candidate events
                                if (ice && ice.candidate && ice.candidate.candidate && ice.candidate.candidate.match(ipRegex)) {
                                    ice.candidate.candidate.match(ipRegex).forEach(ipIterate);                                    
                                }
                                //resolve("FindIPsDone");
                                return;
                            };
                        }
                        catch (ex) {
                            reject(Error(ex));
                        }
                    });// New Promise(...{ ... });
                    return promise;
                };
                //var localIP= new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}});
                return $q.all([serviceIP, findIP(function (ip) { return ip })]);
            }

        },
        hideNavBar:true
    });
    $urlMatcherFactoryProvider.caseInsensitive(true);
    //check browser support
    /*if(window.history && window.history.pushState){
        $locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">
    
        // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase
    
        // if you don't wish to set base URL then use this
        $locationProvider.html5Mode(true)
    }*/
});