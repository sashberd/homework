app.controller('overspeedingBreakdown.widget.settings.controller', function ($scope, $uibModalInstance, $groupsData, $vehicleTypesList, $commonUtils, $widget, $dashboardParent, ivhTreeviewMgr) {//TODO SPLIT TO OWN CONTROLLER

    $scope.widget = $widget;
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

    $scope.vehiclesTypesList = $vehicleTypesList;
    $scope.multiSelectSettings = {
        displayProp: 'NAME',
        idProp: 'ID',
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
        buttonDefaultText: 'Search by all vehicle types'
    };
    $scope.multiSelectModel = [];

    /*set up group drop down settings*/
    $scope.isGroupsLoading = true;
    $scope.selectedGroup = {};

    //$abstractFactory.getGroupsData().then(function (response) {
    $scope.isGroupsLoading = false;
    $scope.groupTreeData = [$commonUtils.refitKeys($commonUtils.listToTree($groupsData.data, {
        idKey: 'VTR_NODE_ID',
        parentKey: 'VTR_PARENT_NODE_ID'
    }), {
        'VTR_NODE_ID': 'value',
        'VTR_NODE_NAME': 'label'
    })[0]];
    if (!$commonUtils.isObjectEmpty($scope.selectedGroup)) {
        ivhTreeviewMgr.select($scope.groupTreeData, $scope.selectedGroup.value, { idAttribute: 'value' });
        $scope.treeButtonText = $scope.selectedGroup.label;
        $scope.selectedGroupCallback($scope.selectedGroup);
    }
    // });
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
    $scope.treeButtonText = 'Search by all groups ';

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    };

    $scope.errorMessage = {
        showError: false
    }
    $scope.ok = function () {
        $scope.errorMessage.showError = false;
        if (!$scope.selectedRange.from && $scope.selectedRange.to) {
            $scope.errorMessage.showError = true;
            $scope.errorMessage.message = 'Date range is required for search'
        }
        else {
            $widget.showEmptySettingsMessage = false;
            $widget.showSpinner = true;
            $dashboardParent.getOverSpeedingDistributionByAmount({
                dateFrom: moment($scope.selectedRange.from + ' ' + $scope.selectedRange.fromHour, 'DD/MM/YYYY HH:mm').toDate(),
                dateTo: moment($scope.selectedRange.to + ' ' + $scope.selectedRange.toHour, 'DD/MM/YYYY HH:mm').toDate(),
                timeFrom: moment($scope.selectedRange.fromHour, ['HH:mm']).toDate(),
                timeTo: moment($scope.selectedRange.toHour, ['HH:mm']).toDate(),
                vehicleTypeId: $scope.multiSelectModel.length ? $scope.multiSelectModel[0].id : -1,
                VehicleGroupId : !$commonUtils.isObjectEmpty($scope.selectedGroup) ? $scope.selectedGroup.GROUP_ID : -1
            }, $widget.id);

            $dashboardParent.dashboardFactory.setSettingsData($widget.id, {
                selectedRange: $scope.selectedRange,
                multiSelectModel: $scope.multiSelectModel,
                selectedGroup: $scope.selectedGroup,
                selectedRangeText: $scope.range
            });
            $scope.cancel();
        }
    }
    if (!$commonUtils.isObjectEmpty($dashboardParent.dashboardFactory.getSettingsData($widget.id))) {
        var oldSettingsData = $dashboardParent.dashboardFactory.getSettingsData($widget.id);
        $scope.selectedRange = oldSettingsData.selectedRange;
        $scope.multiSelectModel = oldSettingsData.multiSelectModel;
        $scope.selectedGroup = oldSettingsData.selectedGroup;
        $scope.range = oldSettingsData.selectedRangeText;
    }
});
