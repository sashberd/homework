app.controller('loginController', function ($api, $state, progressBarManager, $T, localStorageService, $clientData, $security, $timeout, $translate, $css) {
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
                            $state.go('dashboard', {/*'a':true*/ });
                        }, 0);
                    }
                    else {
                        $this.showAlert = true;
                        $this.loginMessage = 'invalidCredential'//'Login failed. Check you credentials!';
                        $this.progressBarValue = 0;
                        $this.showProgressBar = false;
                    }
                }),
                function (data) {
                    $this.showAlert = true;
                    $this.loginMessage = 'loginServerError'//'Connection to server failed. Please contact administrator';
                    $this.progressBarValue = 0;
                    $this.showProgressBar = false;

                });
        } else {
            $this.showAlert = true;
            $this.loginMessage = 'loginFields';//'Please fill all login fields';
            $this.progressBarValue = 0;
            $this.showProgressBar = false;
        }
    };
    this.languageList = [{ alias: 'en', name: 'English', 'url': 'https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/gb.png' },
        { alias: 'he', name: 'עברית', 'url': 'https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/il.png', isRTL:true },
        { alias: 'ru', name: 'Русский', 'url': 'https://raw.githubusercontent.com/stevenrskelton/flag-icon/master/png/16/country-4x3/ru.png' }]

    this.selectedLanguage = this.languageList[0];
    this.onLanguageChange = function () {   

        $translate.use(this.selectedLanguage.alias);
        if (this.selectedLanguage.isRTL) {
            $css.add('js/dist/css/bootstrap-rtl.min.css');
        }
        else {
            $css.remove('js/dist/css/bootstrap-rtl.min.css');
        }
    }
    this.showErrorMessage = function (message) { debugger; }

});