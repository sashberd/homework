app.config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('abstract.dashboard', {
        url: '/dashboard',
        controller: 'dashboardController',
        controllerAs: 'dashboardCtrl',
        templateUrl: 'dashboard.template.html'       
    })
});