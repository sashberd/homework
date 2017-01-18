app.controller('irrigationMotor.widget.settings.controller', function ($scope, $abstractFactory, $uibModalInstance, $commonUtils, $widget, $dashboardParent, $filter, ivhTreeviewMgr) {//TODO SPLIT TO OWN CONTROLLER

    $scope.ranges = [{
        name: 'Today',
        start: moment(),
        end: moment()
    },
        {
            name: 'Yesterday',
            start: moment().subtract(1, 'd'),
            end: moment().subtract(1, 'd')
        },
        {
            name: 'Current Week',
            start: moment().startOf('w'),
            end: moment().endOf('w')
        },
        {
            name: 'Last Week',
            start: moment().subtract(1, 'w').startOf('w'),
            end: moment().subtract(1, 'w').endOf('w')
        },
        {
            name: 'Current Month',
            start: moment().startOf('month'),
            end: moment()
        },
        {
            name: 'Last Month',
            start: moment().subtract(1, 'M').startOf('M'),
            end: moment().subtract(1, 'M').endOf('M')
        }
    ];

    $scope.selectedRange = {
        from: moment().format('DD/MM/YYYY'),
        to: moment().format('DD/MM/YYYY'),
        fromHour: moment().format('HH:mm'),
        toHour: moment().endOf('d').format('HH:mm'),
    };
    $scope.rangeApplied = function (start, end) {
        $scope.selectedRange.from = start.format('DD/MM/YYYY');
        $scope.selectedRange.to = end.format('DD/MM/YYYY');
        $scope.selectedRange.fromHour = start.startOf('d').format('HH:mm');
        $scope.selectedRange.toHour = end.endOf('d').format('HH:mm');
    };

    $scope.vehiclesList = $dashboardParent.vehicleList;
    $scope.multiSelectSettings = {
        displayProp: 'NICK_NAME',
        idProp: 'VEHICLE_BB_ID',
        scrollableHeight: '500px',
        scrollable: true,
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false,
        closeOnSelect: true,
        selectionLimit: 1,
        smartButtonMaxItems: 1,
        smartButtonTextConverter: function (itemText, originalItem) {
            return angular.element(itemText).find('label')[0].innerHTML;
        }
    }
    $scope.multiSelectCustomTexts = {
        buttonDefaultText: 'Select vehicle'
    };
    $scope.multiSelectModel = [];

    /*set up group drop down settings*/
    $scope.isGroupsLoading = true;
    $scope.selectedGroup = {};
    $abstractFactory.getGroupsData().then(function (response) {
        $scope.isGroupsLoading = false;
        $scope.groupTreeData = [$commonUtils.refitKeys($commonUtils.listToTree(response.data, {
            idKey: 'VTR_NODE_ID',
            parentKey: 'VTR_PARENT_NODE_ID'
        }), {
            'VTR_NODE_ID': 'value',
            'VTR_NODE_NAME': 'label'
        })[0]];
        if (!$commonUtils.isObjectEmpty($scope.selectedGroup) ) {
            ivhTreeviewMgr.select($scope.groupTreeData, $scope.selectedGroup.value, { idAttribute: 'value' });
            $scope.treeButtonText = $scope.selectedGroup.label;
            $scope.selectedGroupCallback($scope.selectedGroup);
        }
    });
    $scope.selectedGroupCallback = function (ivhNode, ivhIsSelected, ivhTree) {
        $scope.popoverIsOpen = false;
        $scope.treeButtonText = ivhNode.label
        // $scope.selectedGroup = ivhNode;
        if (ivhNode.VTR_PARENT_NODE_ID) {
            $scope.vehiclesList = $filter('filter')($dashboardParent.vehicleList, function (value, index, array) {
                return value.GROUP_ID == ivhNode.value;
            });
            $scope.selectedGroup = ivhNode;
        } else {
            $scope.vehiclesList = $dashboardParent.vehicleList;
            $scope.selectedGroup = {};
        }
    }
    $scope.treeButtonText = 'Click to filter by groups ';

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };
  
    $scope.errorMessage = {
        showError: false
    }
    $scope.ok = function () {
        $scope.errorMessage.showError = false;
        if (!$scope.multiSelectModel.length) {
            $scope.errorMessage.showError = true;
            $scope.errorMessage.message = 'Vehicle ID is required for search'
        }
        else if (!$scope.selectedRange.from && $scope.selectedRange.to) {
            $scope.errorMessage.showError = true;
            $scope.errorMessage.message = 'Date range is required for search'
        }
        else {
            $dashboardParent.showEmptySettingsMessage = false;
            $dashboardParent.showSpinner = true;
            $dashboardParent.getIrrigationMotorData({
                dateFrom: moment($scope.selectedRange.from + ' ' + $scope.selectedRange.fromHour, 'DD/MM/YYYY HH:mm').toDate(),
                dateTo: moment($scope.selectedRange.to + ' ' + $scope.selectedRange.toHour, 'DD/MM/YYYY HH:mm').toDate(),
                timeFrom: moment($scope.selectedRange.fromHour, ['HH:mm']).toDate(),
                timeTo: moment($scope.selectedRange.toHour, ['HH:mm']).toDate(),
                vehicleID: $scope.multiSelectModel[0].id
            }, $widget.id);
            debugger;
            $dashboardParent.dashboardController.setSettingsData({
                selectedRange: $scope.selectedRange,
                multiSelectModel: $scope.multiSelectModel,
                selectedGroup: $scope.selectedGroup,
                selectedRangeText:$scope.range
            });
            $scope.cancel();
        }
    }
    if (!$commonUtils.isObjectEmpty( $dashboardParent.dashboardController.getSettingsData())) {
        var oldSettingsData = $dashboardParent.dashboardController.getSettingsData();
        $scope.selectedRange = oldSettingsData.selectedRange;
        $scope.multiSelectModel = oldSettingsData.multiSelectModel;
        $scope.selectedGroup = oldSettingsData.selectedGroup;
        $scope.range = oldSettingsData.selectedRangeText;
    }
});