app.config(function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        controller: 'dashboardController',
        controllerAs: 'dashboardCtrl',
        templateUrl: 'dashboard.template.html',
        css: ['js/dist/css/bootstrap.min.css', 'js/dist/css/navigation.min.css',
            'js/dist/css/angular-gridster.min.css', 'js/dist/css/clock.min.css', 'js/dist/css/select.min.css', 'js/dist/css/ui-grid.min.css',
            'js/dist/css/nv.d3.min.css', 'js/dist/css/ob-daterangepicker.min.css', 'js/dist/css/treeselect.min.css','js/dist/css/dashboard.min.css'],
    })
});