app.controller('loginController', function ($api, $state, progressBarManager, $T, localStorageService, $clientData, $security, $timeout) {
    var $this = this;
    this.showProgressBar = false;
    this.progressBarValue = 0;
    this.progressManager = progressBarManager();
    if ($T) {
        $T.ts = moment().add(18, 'm').valueOf()//new Date().addMinutes(18).getTime();
        localStorageService.set('$clientData', $clientData);
        localStorageService.set('$T', $T);
    }

    this.doLogin = function () {
        $this.showAlert = false;
        if (this.username && this.password && this.companyName) {
            var userLoginData = {
                username: this.username,
                password: this.password,
                companyName: this.companyName,
                t: localStorageService.get('$T').T,
            }
            $this.showProgressBar = true;
            $this.progressManager.start();
            $api.sendAPIRequest('Login', 'Login', userLoginData).then(angular.bind(this,
                function (response) {
                    if (response.data && response.data.IsAuthorised) {
                        $this.progressManager.done();
                        var $T = localStorageService.get('$T');
                        $T.TN = $security.generate($this.username, $this.password);
                        $T.UA = navigator.userAgent.replace(/ \.NET.+;/, '');
                        localStorageService.set('$T', $T);
                        $timeout(function () {
                            //$state.go('map', {/*'a':true*/ });
                            $state.go('abstract.dashboard', {/*'a':true*/ });
                        }, 0);
                    }
                    else {
                        $this.showAlert = true;
                        $this.loginMessage = 'Login failed. Check you credentials!';
                        $this.progressBarValue = 0;
                        $this.showProgressBar = false;
                    }
                }),
                function (data) {
                    $this.showAlert = true;
                    $this.loginMessage = 'Connection to server failed. Please contact administrator';
                    $this.progressBarValue = 0;
                    $this.showProgressBar = false;

                });
        } else {
            $this.showAlert = true;
            $this.loginMessage = 'Please fill all login fields';
            $this.progressBarValue = 0;
            $this.showProgressBar = false;
        }
    };
   


});