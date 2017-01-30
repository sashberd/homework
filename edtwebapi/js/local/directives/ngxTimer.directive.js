app.directive('ngxTimer', function ($templateCache, $interval, $interpolate, $animate, $rootScope, $timeout) {
    return {
        scope: false,
        link: function ($scope, element, iAttrs) {
            var refreshInterval, duration, steps, increment, step, intervals = [];
           
            function formatNumber(num) {
                return num > 9 ? '' + num : '0' + num;
            };
            function compileTemplate() {
                var template = $templateCache.get('widgets/clock/clockWidget.template.html');
                var interpolatedTemplate = $interpolate(template)($scope);
                element.html($interpolate(template)($scope));
                var elem = angular.element(document.querySelector('#' + iAttrs.id + ' .inner-box'));
                return elem;
            };
           
            var calculate = function () {
                step = 0;
                refreshInterval = 30;
                duration = 200;
                steps = Math.ceil(duration / refreshInterval);
                increment = Math.ceil($scope.widget.widgetData[iAttrs.timewidgetfor][iAttrs.type] / steps);

            }
            var tick = function () {
                if (parseInt($scope.widget.widgetData[iAttrs.timewidgetfor][iAttrs.type])) {
                    $scope.inervalId = $interval(function ($scope, iAttrs) {
                        $scope.next = formatNumber(parseInt($scope.current) + increment);
                        step++;
                        if (step >= steps) {
                            $scope.current = formatNumber(parseInt($scope.widget.widgetData[iAttrs.timewidgetfor][iAttrs.type]));
                            $animate.addClass(compileTemplate(), 'change');
                            $scope.current = '00';

                        } else {
                            $scope.current = formatNumber(parseInt($scope.next));
                            $animate.addClass(compileTemplate(), 'change');
                        }


                    }, refreshInterval, steps, true, $scope, iAttrs);
                }
                else {
                    $scope.next = formatNumber(parseInt($scope.current) + increment);
                    $scope.current = formatNumber(parseInt($scope.widget.widgetData[iAttrs.timewidgetfor][iAttrs.type]));
                    $animate.addClass(compileTemplate(), 'change');
                }
            }
            var triggerRelink = function () {
                $scope.current = '00';              
                $scope.inervalId = null;
                compileTemplate();
                calculate();
                tick();
            }
            triggerRelink();            
            $scope.$on('updateClockWidget', triggerRelink);

        }
    };
});