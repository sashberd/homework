app.directive('setHeaderStyle', function ($timeout) {
    return {
        scope: {
            headerIndex: '@headerIndex'
        },
        restrict: 'A',
        link: function (scope, element) {

            if (!parseInt(scope.headerIndex)) {
                $timeout(function (headerIndex) {
                    var childrenLabels = angular.element(document.querySelectorAll('.multipleHtmlOptionDiv')[0]).children();
                    element[0].style.width = window.getComputedStyle(childrenLabels[headerIndex]).width;
                }, 100, true, scope.headerIndex);
            }

        }
    }
});