app.filter('mapGridStatusFilter', function ($filter, $mapFactory) {
    return function (data, statusFilter) {
        return data.filter($mapFactory.carsCountFunction.bind(this, statusFilter));
    }
});