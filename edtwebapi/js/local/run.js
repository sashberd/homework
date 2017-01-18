app.run(function ($rootScope, $api, $uibModal, $location, $interval, $document, localStorageService) {

    var $this = this;
    var extendSessionLifetime = function (localStorageService, $api, $document, event) {

        var $T = localStorageService.get('$T');
        /**we add 18 minutes in order not to fall in situation that 20 minutes in server side is already passed.*/
        $T.ts = moment($T.ts).add(18, 'm').valueOf();//new Date($T.ts).addMinutes(18).getTime();
        localStorageService.set('$T', $T);
        $document.off();
        $api.sendAPIRequest('General', 'ECL', localStorageService.get('$T'));
        if (modalDialog) {
            modalDialog.close();
            modalDialog = null;
        }
        startInterval();
    };
    var modalDialog = null;
    var openTimeoutModalDialog = function () {
        $interval.cancel(intervalID);
        if ($location.path().indexOf('login') > -1) {
            $rootScope.timeoutFinished(true);
        }
        else {
            modalDialog = $uibModal.open({
                templateUrl: 'modal/timeout.template.html',
                windowClass: 'modal-danger'
            });
        }
    };


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {       
        if (toState.resolve || toState.name.indexOf('abstract') > -1) {
            //$scope.showSpinner();            
            $rootScope.globalSpinner = true;

        }
    });
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (toState.resolve || toState.name.indexOf('abstract') > -1) {

            $rootScope.globalSpinner = false;
            //startIdle();
        }
    });

    function startInterval() {
        return $interval(function checkLocalStorage(localStorageService, $api, $document, $uibModal) {
            var key = localStorageService.get('$T');
            if (key) {
                var minutesLeft = Math.floor((new Date(parseInt(key.ts)) - new Date()) / 60000);
                if (minutesLeft <= 2) {
                    openTimeoutModalDialog();
                }
                if (minutesLeft <= 5) {
                    $document.off().on('keydown DOMMouseScroll mousewheel mousedown touchstart touchmove scroll click', extendSessionLifetime.bind($this, localStorageService, $api, $document))
                }
            }
            return checkLocalStorage

            // delete all the required localStorage variables by specifying their keys
        }(localStorageService, $api, $document, $uibModal), 5000/*1000 * 60*/, 0, true, localStorageService, $api, $document, $uibModal);
    }

    var intervalID = startInterval();

    $rootScope.timeoutFinished = function (isReload) {
        $document.off();
        localStorageService.clearAll();
        if (modalDialog) {
            modalDialog.close();
            modalDialog = null;
        }
        isReload ? location.reload() : $location.path('/login');
    }   
});