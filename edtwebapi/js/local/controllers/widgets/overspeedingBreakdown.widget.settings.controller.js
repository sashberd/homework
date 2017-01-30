app.controller('overspeedingBreakdown.widget.settings.controller', function ($scope, $uibModalInstance, $groupsData, $vehicleTypesList, $commonUtils, $widget, $dashboardParent) {//TODO SPLIT TO OWN CONTROLLER

    $scope.widget = $widget;
    $scope.uibModalInstance = $uibModalInstance;
    $scope.groupsData = $groupsData;
    $scope.vehiclesTypesList = $vehicleTypesList;  

    /*custom widget options*/
    $scope.treeButtonText = 'Search by all groups ';
    $scope.multiSelectVehicleTypesCustomTexts = {
        buttonDefaultText: 'Search by all vehicle types'
    };
    $scope.controllerValidations = ['datePickerValidation'];
    /***********************************************/

    $scope.affirmative = function () {
        $dashboardParent.getOverSpeedingDistributionByAmount({
            dateFrom: moment($scope.selectedRange.from + ' ' + $scope.selectedRange.fromHour, 'DD/MM/YYYY HH:mm').toDate(),
            dateTo: moment($scope.selectedRange.to + ' ' + $scope.selectedRange.toHour, 'DD/MM/YYYY HH:mm').toDate(),
            timeFrom: moment($scope.selectedRange.fromHour, ['HH:mm']).toDate(),
            timeTo: moment($scope.selectedRange.toHour, ['HH:mm']).toDate(),
            vehicleTypeId: $scope.multiSelectVehicleTypesModel && $scope.multiSelectVehicleTypesModel.selected ? $scope.multiSelectVehicleTypesModel.selected.ID : -1,          
            vehicleGroupId: !$commonUtils.isObjectEmpty($scope.selectedGroup) ? $scope.selectedGroup.GROUP_ID : -1
        }, $widget.id);

    }   
   
    
});
