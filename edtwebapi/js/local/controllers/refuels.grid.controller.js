app.controller('refuelController', function ($scope,$fuelSupplierResolve, $refuelsPumpsResolve, $typesAndSourcesResolve, $driversResolve, $searchTagsResolve, $refuelsGridFactory, $api, $commonUtils) {
    var $this = this;

    this.loading = false;
    this.errorMessageData = {};
    this.fuelSupplierResolve = $fuelSupplierResolve;
    this.refuelsPumpsResolve = $refuelsPumpsResolve;
    this.typesAndSourcesResolve = $typesAndSourcesResolve;
    this.driversResolve = $driversResolve;
    this.searchTagsResolve = $searchTagsResolve;
    $refuelsGridFactory.setValidators();
    /*Accordion open close state */
    this.isOpen = true;

    /*Pumps states and typeahead states and functions*/
    this.pumpsData = $refuelsPumpsResolve;
    this.onPumpSelected = function (selectedPump) {
        this.pumpSelectedItem = selectedPump;
    }
    this.filterPumps = $refuelsGridFactory.filterPumps;
    /***************************************************************/

    /*types and search states and combo button functions*/
    this.typesAndSourcesList = $typesAndSourcesResolve
    this.changeTypeAndSourceSelectedItem = function (typeAndSource) {
        this.selectedRefuelTypeAndSourceOption = typeAndSource;
    }
    /****************************************************************/

    /*drivers states and typeahead functions*/
    this.driversList = $driversResolve;
    this.filterDrivers = $refuelsGridFactory.filterDrivers
    this.onDriverSelected = function (selectedItem) {
        this.driverSelectedItem = selectedItem;
    }
    /************************************************************************/

    /*vehivle tags states and typeahead functions*/
    this.searchTagsList = $searchTagsResolve;
    this.filterTags = $refuelsGridFactory.filterTags
    this.onTagSelected = function (selectedItem) {
        this.tagSelectedItem = selectedItem;
    }
    /***********************************************************************/

    /*supplier state*/
    this.fuelSuppliersList = $fuelSupplierResolve;
    /***************************************************/

    /*Date time pickers states and functions*/
    this.modelOptions = $commonUtils.getCommonTypeaheadModelOptions();
    var dateTimeOptions = $commonUtils.getCommonDatePickerOptions();
    this.dateOptions = dateTimeOptions.dateOptions;

    this.format = dateTimeOptions.dateFormat;
    this.altInputFormats = dateTimeOptions.inputFormats;
    this.startDateOpen = function () {
        this.startDateTimeData.opened = true;
    };
    this.startDateTimeData = {
        opened: false
    };
    this.endDateOpen = function () {
        this.endDateTimeData.opened = true;
    };
    this.endDateTimeData = {
        opened: false
    };
    /***********************************************************************/

 

    /*Defining scoped promises callbacks*/
    this.showSuccessMessage = function (data) {
        $this.errorMessageData = {
            refuelErrorMessage: 'The data was successfully updated',
            refuelAlertType: 'success'
        }
    }
    this.showErrorMessage = function (data) {
        $this.errorMessageData = {
            refuelErrorMessage: 'Failed to update data. Please contact administrator',
            refuelAlertType: 'danger'
        }
    }
    this.onPromiseComplete = function () {
        $this.loading = false;
    }
    /************************************************/

    /*on page validation function*/
    this.checkSearchFilters = $refuelsGridFactory.checkSearchFilter
    /*******************************************************/

    /*button seach click function*/
    this.searchRefuels = $refuelsGridFactory.searchRefuels
    /***************************************************************/

    /*building grid*/
    this.gridOptions = {
        enableSorting: false,
        enableColumnMenus: false,
        minRowsToShow: 20,
        rowEditWaitInterval: 3000,
        appScopeProvider: this,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 2,
        onRegisterApi: function (gridApi) {
            //set gridApi on scope
            $this.gridApi = gridApi;            
            gridApi.rowEdit.on.saveRow(null, $refuelsGridFactory.saveRow);
        },
        data: [],
        columnDefs: $refuelsGridFactory.getGridColumnsDefinitions(this)
    };  
    /***************************************************************/

    /*Using angular-360-no-scope for bind $watch functionality fwith controller as syntax*/
    $scope.$watchGroup(['pumpSelectedItem', 'driverSelectedItem', 'tagSelectedItem', 'startDateTime', 'endDateTime'], function (newValue, oldValue) {
        $this.gridOptions.data.length = 0
    }, true)
});