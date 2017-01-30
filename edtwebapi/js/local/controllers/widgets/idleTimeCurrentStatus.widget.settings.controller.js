app.controller('idleTimeCurrentStatus.widget.settings.controller', function ($scope, $uibModalInstance, $groupsData, $vehicleList,$vehicleTypesList, $commonUtils, $widget, $dashboardParent) {//TODO SPLIT TO OWN CONTROLLER
    $scope.widget = $widget;
    
    $scope.uibModalInstance = $uibModalInstance;
    $scope.groupsData = $groupsData;
    $scope.vehiclesList = $vehicleList;
    $scope.vehiclesTypesList = $vehicleTypesList;

    /*custom widget options*/
    $scope.treeButtonText = 'Click to filter by groups';
    $scope.multiSelectVehiclesCustomTexts = {
        buttonDefaultText: 'Search by all vehicles'
    };
    $scope.multiSelectVehicleTypesCustomTexts = {
        buttonDefaultText: 'Search by all vehicle types'
    };
    $scope.controllerValidations = [];

    $scope.affirmative = function () {
        $dashboardParent.getIdleTimeData($widget, {
            vehicleTypeId: $scope.multiSelectVehicleTypesModel && $scope.multiSelectVehicleTypesModel.selected? $scope.multiSelectVehicleTypesModel.selected.ID : -1,
            vehicleId: $scope.multiSelectVehiclesModel && $scope.multiSelectVehiclesModel.selected?$scope.multiSelectVehiclesModel.selected.VEHICLE_BB_ID:-1,
            vehicleGroupId: $scope.selectedGroup.value
        } );

    };

});