app.config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('refuels', {
        url: '/refuels',
        controller: 'refuelController',
        controllerAs: 'refuelCtrl',
        templateUrl: 'refuel.grid.template.html',
        resolve: {
            $refuelsPumpsResolve: function ($api, $refuelsGridFactory, localStorageService) {              
                return $api.sendAPIRequest('Refuels', 'GetUserPumps',localStorageService.get('$T')).then($refuelsGridFactory.getResolveSuccessFunction());
            },
            $typesAndSourcesResolve: function ($api, $refuelsGridFactory, localStorageService) {
                return $api.sendAPIRequest('Refuels', 'GetUserTypeAndSources', localStorageService.get('$T')).then($refuelsGridFactory.getResolveSuccessFunction());
            },
            $driversResolve: function ($api, $refuelsGridFactory, localStorageService) {
                return $api.sendAPIRequest('Refuels', 'GetUserDrivers', localStorageService.get('$T')).then($refuelsGridFactory.getResolveSuccessFunction());
            },
            $searchTagsResolve: function ($api, $refuelsGridFactory, localStorageService) {
                return $api.sendAPIRequest('Refuels', 'GetUserSearchTags', localStorageService.get('$T')).then($refuelsGridFactory.getResolveSuccessFunction());
            },
            $fuelSupplierResolve: function ($api, $refuelsGridFactory, localStorageService) { 
                return $api.sendAPIRequest('Refuels', 'GetUserFuelSuppliers', localStorageService.get('$T')).then($refuelsGridFactory.getResolveSuccessFunction());
            }
        },
        css: ['js/dist/css/bootstrap.min.css', 'js/dist/css/navigation.min.css', 'js/dist/css/ui-grid.min.css', 'js/dist/css/refuels.min.css', 'js/dist/css/select.min.css'],
    })
    $urlMatcherFactoryProvider.caseInsensitive(true);
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/login');
  /*  if (window.history && window.history.pushState) {
        $locationProvider.html5Mode(true); //will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

        // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

        // if you don't wish to set base URL then use this
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }*/
});