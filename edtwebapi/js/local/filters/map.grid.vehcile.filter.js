app.filter('mapGridVehicleFilter', function ($filter) {
    return function (data, vehicleFilter) {
        return data.filter(function (item) { return item.VEHICLE_ID.toString() === vehicleFilter });
    }
});