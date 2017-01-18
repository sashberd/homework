app.directive('navbarVisibility', function ($rootScope,$location) {
    return {
        scope: false,
        link: function ($scope, element, iAttrs) {
            var checkState = function () {
                if ($location.path().indexOf('login') > -1) {
                    element.css('display', 'none');
                }
                else {
                    element.css('display', 'block');
                }
            }
            $rootScope.$on('$stateChangeSuccess', function () {
                checkState() // scope.$state is added in main controller 
            });
            checkState();
        }
    };
});