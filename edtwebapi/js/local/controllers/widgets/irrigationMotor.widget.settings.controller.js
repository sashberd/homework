app.controller('irrigationMotor.widget.settings.controller', function ($scope, $uibModalInstance, $groupsData, $vehicleList, $commonUtils, $widget, $dashboardParent) {//TODO SPLIT TO OWN CONTROLLER
    $scope.widget = $widget;
    $scope.uibModalInstance = $uibModalInstance;
    $scope.groupsData = $groupsData;
    $scope.vehiclesList = $vehicleList;

    /*custom widget options*/
    $scope.treeButtonText = 'Click to filter by groups';
    $scope.multiSelectVehiclesCustomTexts = {
        buttonDefaultText: 'Select vehicle'
    };
    $scope.controllerValidations = ['datePickerValidation', 'vehiclesDropDownValidation'];


    $scope.affirmative = function () {
        $dashboardParent.getIrrigationMotorData({
            dateFrom: moment($scope.selectedRange.from + ' ' + $scope.selectedRange.fromHour, 'DD/MM/YYYY HH:mm').toDate(),
            dateTo: moment($scope.selectedRange.to + ' ' + $scope.selectedRange.toHour, 'DD/MM/YYYY HH:mm').toDate(),
            timeFrom: moment($scope.selectedRange.fromHour, ['HH:mm']).toDate(),
            timeTo: moment($scope.selectedRange.toHour, ['HH:mm']).toDate(),           
            vehicleId: $scope.multiSelectVehiclesModel && $scope.multiSelectVehiclesModel.selected ? $scope.multiSelectVehiclesModel.selected.VEHICLE_BB_ID : -1,
        }, $widget.id);

    };

});