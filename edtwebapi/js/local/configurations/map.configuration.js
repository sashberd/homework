app.config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('map', {
        url: '/map?login=a',
        controller: 'mapController',
        controllerAs: 'mapCtrl',
        templateUrl: 'map.template.html',
        resolve: {
            $mapData: function ($vehiclesList, $mapFactory) {
                return $mapFactory.getMapData($vehiclesList);
            },
            $vehiclesList: function ($abstractFactory) {
                return $abstractFactory.getVehicleList()
            }
        },
        css: ['js/dist/css/bootstrap.min.css', 'js/dist/css/navigation.min.css', 'js/dist/css/ui-grid.min.css',
           'js/dist/css/hover-min.min.css', 'js/dist/css/leaflet.min.css', 'js/dist/css/MarkerCluster.min.css',
           'js/dist/css/select.min.css', 'js/dist/css/treeselect.min.css', 'js/dist/css/map.min.css'],

    });
    $urlMatcherFactoryProvider.caseInsensitive(true);
    /*if (window.history && window.history.pushState) {
        $locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

        // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

        // if you don't wish to set base URL then use this
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }*/
});