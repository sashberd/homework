app.controller('mapController', function ($scope, $mapFactory, $vehiclesList, $abstractFactory, $mapData, $commonUtils, $timeout, $interval, $location) {

    this.vehiclesList = $vehiclesList;
    this.mapData = $mapData;
    angular.extend($scope, $mapFactory.buildMapData($mapData, $scope));
    var $this = this;

    /*building grid*/
    this.gridOptions = {
        enableColumnMenus: false,
        enableCellEdit: false,
        minRowsToShow: 20,
        rowEditWaitInterval: 3000,
        appScopeProvider: this,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 2,
        onRegisterApi: function (gridApi) {
            //set gridApi on scope     
            $this.gridApi = gridApi;
        },
        data: [],
        columnDefs: $mapFactory.getMapGridColumnsDefinition()
    }
    /* Help functions for determinign current view of mapview   */
    this.getRowStatus = $mapFactory.getRowStatus;
    this.getRowTooltip = $mapFactory.getRawTooltip;

    /*special timeout dor determining offset of loading spinner  */
    $timeout(function ($scope) {
        $scope.gridOptions.data = $scope.vehiclesList;
        var mapSumLabel = angular.element(document.getElementsByClassName('mapSumLabel'));
        $commonUtils.setElementOffset(document.getElementsByClassName('gridSpinner'), $commonUtils.getElementOffset(mapSumLabel));
    }, 200, true, this);
    /******************************************************/

    /*Interval for update from server side*/
    var intervalStop = $interval(function ($scope) {
        if ($location.path().indexOf('map') > -1) {
            $scope.isRefresh = true;
            $abstractFactory.getVehicleList().then(function (response) {
                if ($scope.gridOptions.isFiltered) {
                    $this.vehiclesList = $commonUtils.getArrayUniqueValues(response, $this.vehiclesList, 'VEHICLE_ID')
                    $this.handleFiltering();
                }
                else {
                    $scope.gridOptions.data = response;
                    $scope.vehiclesList = response;
                }
                $scope.gridApi.core.queueGridRefresh();
                $mapFactory.getMapData(response).then(function (data) {
                    if ($scope.isMapFiltered) {
                        $scope.mapData = data;
                        $scope.applyFiltersOnMap();
                    }
                    else {
                        angular.extend($scope, $mapFactory.buildMapData(data));
                    }
                });

            }).finally(function () { $scope.isRefresh = false });
        }
        else {
            $interval.cancel(intervalStop);
        }
    }, 30000, 0, true, this);
    /******************************************************/

    /*Calculate labels for all car labels*/
    this.calculateCarsLabels = function (carsData) {
        this.inMotionCarsCount = carsData.filter($mapFactory.carsCountFunction.bind(this, 1)).length;
        this.idleCarsCount = carsData.filter($mapFactory.carsCountFunction.bind(this, 2)).length;
        this.engineOffCarsCount = carsData.filter($mapFactory.carsCountFunction.bind(this, 3)).length;
        this.alertCarsCount = carsData.filter($mapFactory.carsCountFunction.bind(this, 4)).length;
        this.totalCarsCount = carsData.length;
    }
    this.calculateCarsLabels(this.vehiclesList);
    /******************************************************/

    /*Setup settings for multiselect drop down button*/
    this.multiSelectSettings = { displayProp: 'NICK_NAME', idProp: 'VEHICLE_BB_ID', scrollableHeight: '500px', scrollable: true, enableSearch: true }
    this.multiSelectCustomTexts = { buttonDefaultText: 'Click to filter by vehicle' };
    this.multiSelectModel = [];
    this.multiselectEvents = {
        onItemSelect: function (item) { $this.filterByVehicles(item, true) },
        onItemDeselect: function (item) { $this.filterByVehicles(item, false) },
        onSelectAll: function ($innerScope) { $this.selectAllVehicles($innerScope) },
        onDeselectAll: function ($innerScope) { $this.unselectAllVehicles($innerScope) }
    };
    this.selectAllVehicles = $mapFactory.selectAllVehicles;
    this.unselectAllVehicles = $mapFactory.unselectAllVehicles
    /******************************************************/

    /*filters code block*/
    this.filters = { groupFilters: [], vehicleFilters: [], statusFilters: [], textFilter: '' }
    this.filterByGroups = $mapFactory.filterByGroups
    this.filterByVehicles = $mapFactory.filterByVehicles;
    this.filterByStatus = $mapFactory.filterByStatus
    this.handleFiltering = $mapFactory.handleFiltering;
    this.applyFiltersOnMapGrid = $mapFactory.applyFiltersOnMapGrid;
    this.carsCountFunction = $mapFactory.carsCountFunction;
    this.filterByText = $mapFactory.handleFiltering;
    this.clearAllFilters = $mapFactory.clearAllFilters;
    /******************************************************/


    /*set up group drop down seings*/
    this.isGroupsLoading = true;
    this.isGroupsCollapsed = true;
    $abstractFactory.getGroupsData().then(function (response) {
        $this.isGroupsLoading = false;
        $this.groupTreeData = [$commonUtils.refitKeys($commonUtils.listToTree(response.data, { idKey: 'VTR_NODE_ID', parentKey: 'VTR_PARENT_NODE_ID' }), { 'VTR_NODE_ID': 'value', 'VTR_NODE_NAME': 'label' })[0]];
    });
    this.selectAllGroups = $mapFactory.selectAllGroups;
    this.unselectAllGroups = $mapFactory.unselectAllGroups;
    /******************************************************/
    /*applying filter on map function     */
    this.applyFiltersOnMap = function () {
        var filteredMapData = this.mapData.filter(function (itemOnMap) { return $this.gridOptions.data.some(function (itemInGrid) { return itemOnMap.VEHICLE_ID == itemInGrid.VEHICLE_ID }) });
        angular.extend($scope, $mapFactory.buildMapData(filteredMapData));
        this.isMapFiltered = true;
    }
    /******************************************************/
    /*Observer for filter array changes.*/
    var filterObserver = $interval(function ($scope) {
        if ($location.path().indexOf('map') > -1) {
            if ($commonUtils.isObjectEmpty($scope.filters)) {
                $scope.applyFiltersOnMap();
            }
            $scope.calculateCarsLabels($scope.gridOptions.data);
        }
        else {
            $interval.cancel(filterObserver);
        }
    }, 1500, 0, true, this);
    /******************************************************/
});