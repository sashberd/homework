app.directive("dynamicSettingsDirective", function ($filter, $commonUtils, $dashboardFactory, ivhTreeviewMgr) {
    return {
        restrict: "E",
        //replace: true,
        scope: false,
        //transclude:true,        
        template: function (element, attrs) {
            var template = '<div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()">&times;</button> <h3>{{widget.settingsTitle}}</h3></div>';
            template += '<div class="modal-body">{{popoverIsOpen}}';
            /*Insert new html element here*/
            template += '<div ng-if="directiveSettings.showDateRangePicker">    <div  class="row">        <label for="clockWidgetRanges" class="control-label">Select Date Range</label><ob-daterangepicker id="clockWidgetRanges" auto-apply="true" on-apply="rangeApplied(start,end)" ranges="ranges" range="range" calendars-always-on="false" class="center"></ob-daterangepicker>    </div>    <div class="clockWidgetFilters row">        <label for="clockWidgetFromDate" class="control-label">From</label><input id="clockWidgetFromDate" ng-model="selectedRange.from" /><label for="clockWidgetToDate" class="control-label">To</label><input id="clockWidgetToDate" ng-model="selectedRange.to" />        <input id="clockWidgetFromHour" class="clockSettingsMinutes" ng-model="selectedRange.fromHour" /><input id="clockWidgetToHour" class="clockSettingsMinutes" ng-model="selectedRange.toHour" />    </div></div>';
            template += '<div ng-if="directiveSettings.showCompanyTreeSelect" class="row mapGridFilters"> <div class="col-xs-6 col-sm-6 col-md-6"> <div class="row"><label for="btnVehicleGroup" class="control-label">Vehicle group</label> <button id="btnVehicleGroup" uib-popover-template="\'treeSelect/treeselect.template.html\'" popover-is-open="popoverIsOpen"   ng-click="popoverIsOpen = !popoverIsOpen"    popover-trigger="\'outsideClick\'"  popover-placement="bottom" type="button" class="btn btn-default">   {{treeButtonText}}  <span class="caret pull-right"></span> </button></div></div></div>';
            //template += '<div ng-if="directiveSettings.showCompanyVehicleType" class="row mapGridFilters"><div class="col-xs-6 col-sm-6 col-md-6"> <div class="row"><label for="clockWidgetFromDate" class="control-label">Vehicle</label><div ng-dropdown-multiselect="" options="vehiclesTypesList" ng-style="{\'width\':multiselectULMinWidth}" translation-texts="multiSelectVehicleTypesCustomTexts" selected-model="multiSelectVehicleTypesModel"  extra-settings="multiSelectVehcileTypesSettings" ></div> <div uib-alert ng-class="\'alert-danger\' " ng-show="errorMessage.showError">{{errorMessage.message}}</div></div></div></div>';
            template += '<div ng-if="directiveSettings.showCompanyVehicleType" class="row mapGridFilters"><div class="col-xs-6 col-sm-6 col-md-6"><div class="row"><label for="cbxVehicleTypes" class="control-label">Vehicle Types</label><ui-select ng-model="multiSelectVehicleTypesModel.selected" theme="bootstrap" ng-disabled="disabled" id="cbxVehicleTypes" title="Choose vehicle type" style="max-width: 630px"><ui-select-match allow-clear="true"  placeholder="Click to filter by vehicle type">{{$select.selected.NAME}}</ui-select-match><ui-select-choices  repeat="vehicleTypesData  in vehiclesTypesList | filter:  { NAME: $select.search}"><div ng-bind-html="vehicleTypesData.NAME | highlight: $select.search"></div></ui-select-choices> </ui-select><div uib-alert ng-class="\'alert-danger\' " ng-show="errorMessage.showError">{{errorMessage.message}}</div></div></div></div>';
            //template += '<div ng-if="directiveSettings.showCompanyVehicles" class="row mapGridFilters"> <div class="col-xs-6 col-sm-6 col-md-6">  <div class="row"> <label for="clockWidgetFromDate" class="control-label">Vehicle</label><div ng-dropdown-multiselect="" options="vehiclesList" ng-style="{\'width\':multiselectULMinWidth}" translation-texts="multiSelectVehiclesCustomTexts" selected-model="multiSelectVehiclesModel" extra-settings="multiSelectVehiclesSettings" headers=\'{ "Nickname": "NICK_NAME", "ID": "VEHICLE_BB_ID"}\'></div><div uib-alert ng-class="\'alert-danger\' " ng-show="errorMessage.showError">{{errorMessage.message}}</div> </div></div></div>';
            template += '<div ng-if="directiveSettings.showCompanyVehicles" class="row mapGridFilters"><div class="col-xs-6 col-sm-6 col-md-6"><div class="row"><label for="cbxVehicles" class="control-label">Vehicle</label><ui-select ng-model="multiSelectVehiclesModel.selected" theme="bootstrap" ng-disabled="disabled" id="cbxVehicles" title="Choose vehicle" style="max-width: 630px"><ui-select-match allow-clear="true"  placeholder="Click to filter by vehicle">{{$select.selected.NICK_NAME}} {{$select.selected.VEHICLE_BB_ID}}</ui-select-match><ui-select-choices  repeat="vehicleData  in vehiclesList | propsFilter:  { NICK_NAME: $select.search,VEHICLE_BB_ID: $select.search}"><div ng-bind-html="vehicleData.NICK_NAME | highlight: $select.search"></div><small><div>VehicleId: <span ng-bind-html="\'\'+vehicleData.VEHICLE_BB_ID | highlight: $select.search"></span></div><div>Driver Name:  {{vehicleData.DRIVER_NAME}}</div></small></ui-select-choices></ui-select> <div uib-alert ng-class="\'alert-danger\' " ng-show="errorMessage.showError">{{errorMessage.message}}</div></div></div></div>';
            /*****************************/

            template += '</div>'
            template += '<div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="ok()">OK</button></div>';
            element.html(template);
        },
        link: function ($scope, element, attrs) {
            $scope.directiveSettings = {
                showDateRangePicker: false,
                showCompanyTreeSelect: false,
                showCompanyVehicleType: false,
                showCompanyVehicles: false
            }
            
            angular.extend($scope.directiveSettings, $scope.widget.settingsTemplateParts);

            if ($scope.directiveSettings.showDateRangePicker) {
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
                $scope.range = {};
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

                $scope.datePickerValidation = function () {
                    var result = true;
                    if (!$scope.selectedRange.from && $scope.selectedRange.to) {
                        $scope.errorMessage.showError = true;
                        $scope.errorMessage.message = 'Date range is required for search'
                        result = false;
                    }
                    return result;
                }
            }
            if ($scope.directiveSettings.showCompanyTreeSelect) {
                /*set up group drop down settings*/
                $scope.isGroupsLoading = true;
                $scope.selectedGroup = {};
              
                $scope.isGroupsLoading = false;
                $scope.groupTreeData = [$commonUtils.refitKeys($commonUtils.listToTree($scope.groupsData.data, {
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

                $scope.selectedGroupCallback = function (ivhNode, ivhIsSelected, ivhTree) {
                    $scope.popoverIsOpen = false;
                    $scope.treeButtonText = ivhNode.label

                    if (ivhNode.VTR_PARENT_NODE_ID) {
                        $scope.vehiclesList = $filter('filter')($scope.vehiclesList, function (value, index, array) {
                            return value.GROUP_ID == ivhNode.value;
                        });
                        $scope.selectedGroup = ivhNode;
                    } else {
                        $scope.vehiclesList = $scope.vehiclesList;
                        $scope.selectedGroup = {};
                    }
                    
                }
            }
            if ($scope.directiveSettings.showCompanyVehicleType) {
                $scope.multiSelectVehcileTypesSettings = {
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
                        return /<[a-z][\s\S]*>/i.test(itemText) ? angular.element(itemText).find('label')[0].innerHTML : itemText;
                    }
                }
                $scope.multiSelectVehicleTypesModel = {selected:null};
            }

            if ($scope.directiveSettings.showCompanyVehicles) {
                $scope.multiSelectVehiclesSettings = {
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
                $scope.multiSelectVehiclesModel = { selected: null };
                $scope.vehiclesDropDownValidation = function () {
                    var result = true;
                    if (!$scope.multiSelectVehiclesModel || !$scope.multiSelectVehiclesModel.selected) {
                        $scope.errorMessage.showError = true;
                        $scope.errorMessage.message = 'Vehicle ID is required for search';
                        result = false;
                    }
                    return result;
                }
            }
            $scope.cancel = function () {
                $scope.uibModalInstance.dismiss();
            };

            $scope.errorMessage = {
                showError: false
            }
            $scope.ok = function () {
                debugger;
                $scope.errorMessage.showError = false;
                if (!$scope.controllerValidations.length || $scope.controllerValidations.every(function (item) {
                    var fn = $scope[item];
                    return fn && fn();
                })) {
                    $scope.widget.showEmptySettingsMessage = false;
                    $scope.widget.showSpinner = true;
                    $scope.affirmative();
                    $dashboardFactory.setSettingsData($scope.widget.id, {
                        selectedRange: $scope.selectedRange,
                        multiSelectVehicleTypesModel: $scope.multiSelectVehicleTypesModel,
                        multiSelectVehiclesModel:$scope.multiSelectVehiclesModel,
                        selectedGroup: $scope.selectedGroup,
                        selectedRangeText: $scope.range
                    });
                    $scope.cancel();
                }
            }

            if (!$commonUtils.isObjectEmpty($dashboardFactory.getSettingsData($scope.widget.id))) {
                var oldSettingsData = $dashboardFactory.getSettingsData($scope.widget.id);
                $scope.selectedRange = oldSettingsData.selectedRange;
                $scope.multiSelectVehicleTypeModel = oldSettingsData.multiSelectVehicleTypeModel;
                $scope.multiSelectVehiclesModel = oldSettingsData.multiSelectVehiclesModel;
                $scope.selectedGroup = oldSettingsData.selectedGroup;
                $scope.range = oldSettingsData.selectedRangeText;
                if ($scope.selectedGroup && !$commonUtils.isObjectEmpty($scope.selectedGroup)) {
                    $scope.selectedGroupCallback($scope.selectedGroup);
                }
            }

        }
    };
});